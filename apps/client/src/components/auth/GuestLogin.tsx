import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { User, Sparkles, ArrowRight, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuestLogin: React.FC = () => {
  const { signInAsGuest, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signInAsGuest(displayName || undefined);
      navigate('/select-standard');
    } catch (error) {
      console.error('Guest login error:', error);
    }
  };

  const handleQuickStart = async () => {
    try {
      await signInAsGuest();
      navigate('/select-standard');
    } catch (error) {
      console.error('Quick start error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Start Option */}
      <div className="text-center">
        <button
          onClick={handleQuickStart}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Gamepad2 className="w-5 h-5" />
              <span>Quick Start</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Start playing immediately as a guest
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/10 text-gray-400">or</span>
        </div>
      </div>

      {/* Custom Guest Name */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-300 mb-2">
            Choose a Display Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="guestName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Start as Guest</span>
            </>
          )}
        </button>
      </form>

      {/* Guest Mode Info */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Guest Mode Features</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Play all educational games</li>
              <li>• Earn XP and level up</li>
              <li>• Collect badges and achievements</li>
              <li>• Progress saved locally</li>
              <li>• Sign up anytime to save permanently</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GuestLogin; 