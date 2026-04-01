import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressProvider } from '../../contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Gamepad2, 
  Trophy, 
  Star, 
  Settings, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import GameGrid from './GameGrid';
import ProgressChart from './ProgressChart';
import QuickStats from './QuickStats';
import Leaderboard from './Leaderboard';

const MainDashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <ProgressProvider user={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GameLearn Dashboard</h1>
                <p className="text-gray-300">Welcome back, {currentUser.displayName}!{currentUser.standard ? ` (Class ${currentUser.standard})` : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick Stats */}
            <QuickStats user={currentUser} />
            
            {/* Games Grid */}
            <GameGrid />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Progress Chart */}
            <ProgressChart user={currentUser} />
            
            {/* Level Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-white">Level Progress</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Level {currentUser.level}</span>
                    <span>{currentUser.xp} / {currentUser.level * 100} XP</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentUser.xp % 100) / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.level}</div>
                  <div className="text-sm text-gray-400">Current Level</div>
                </div>
              </div>
            </div>
            
            {/* Leaderboard */}
            <Leaderboard />
          </motion.div>
        </div>
      </div>
      </div>
    </ProgressProvider>
  );
};

export default MainDashboard;