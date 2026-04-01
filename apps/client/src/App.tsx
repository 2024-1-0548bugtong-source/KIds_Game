import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/toaster';
import { ProgressProvider } from './contexts/ProgressContext';
import AuthPage from './components/auth/AuthPage';
import MainDashboard from './components/dashboard/MainDashboard';
import ProfilePage from './components/profile/ProfilePage';
import SelectStandardPage from './components/auth/SelectStandardPage';
import ChatbotProvider from './components/chatbot/ChatbotProvider';
import { initializeSocket, disconnectSocket } from './services/socketService';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/main" />;
}

function RequireStandard({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
  if (!('standard' in currentUser) || !currentUser.standard) {
    return <Navigate to="/select-standard" />;
  }
  return children;
}

function AppRoutes() {
  return (
    <ProgressProvider>
      <ChatbotProvider>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          <Route path="/select-standard" element={
            <ProtectedRoute>
              <SelectStandardPage />
            </ProtectedRoute>
          } />
          <Route path="/main" element={
            <ProtectedRoute>
              <RequireStandard>
                <MainDashboard />
              </RequireStandard>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ChatbotProvider>
    </ProgressProvider>
  );
}

function App() {
  // Initialize socket connection when app starts
  useEffect(() => {
    // Initialize socket
    const socket = initializeSocket();
    
    // Clean up socket connection when app unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <AppRoutes />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;