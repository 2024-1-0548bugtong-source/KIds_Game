import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import GuestLogin from './GuestLogin';
import { Gamepad2, Users, Star, Zap } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guest'>('login');

  const tabs = [
    { id: 'login', label: 'Sign In', icon: Users },
    { id: 'signup', label: 'Sign Up', icon: Star },
    { id: 'guest', label: 'Guest Mode', icon: Zap }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center text-white"
        >
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold">GameLearn</h1>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learn Through Play
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform education into an exciting adventure! Our AI-powered platform makes learning 
              fun, engaging, and personalized for students in grades 5-10.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-300">AI-Powered Adaptive Learning</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-300">Gamified Progress & Rewards</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-300">Interactive Educational Games</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-white/10 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'login' && <LoginForm />}
              {activeTab === 'signup' && <SignupForm />}
              {activeTab === 'guest' && <GuestLogin />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage; 