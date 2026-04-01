import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLeaderboard, LeaderboardEntry } from '../../services/apiService';
import { onLeaderboardUpdate } from '../../services/socketService';

// Using LeaderboardEntry interface from apiService

const Leaderboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchLeaderboard(10);
      
      if (response.success && Array.isArray(response.leaderboard)) {
        setLeaderboard(response.leaderboard);
      } else {
        throw new Error(response.error || 'Invalid leaderboard data format');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    getLeaderboard();
    
    // Set up real-time updates
    const unsubscribe = onLeaderboardUpdate((data) => {
      console.log('Leaderboard update received:', data);
      if (data && Array.isArray(data)) {
        setLeaderboard(data);
      } else if (data && data.leaderboard && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    });
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Function to refresh leaderboard manually
  const handleRefresh = () => {
    getLeaderboard();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-bold text-white">Leaderboard</h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Refresh leaderboard"
          disabled={isLoading}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-4 h-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No data available yet</p>
          ) : (
            leaderboard.map((entry, index) => {
              const isCurrentUser = currentUser && entry.userId === currentUser.uid;
              
              return (
                <motion.div 
                  key={entry.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center p-2 rounded-lg ${isCurrentUser ? 'bg-purple-900/50 border border-purple-500/50' : 'hover:bg-white/5'}`}
                >
                  <div className="flex-shrink-0 w-8 text-center font-bold text-gray-400">
                    {index + 1}
                  </div>
                  
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-2">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt="User" className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-medium text-white truncate">
                      {isCurrentUser ? 'You' : `User ${entry.userId.substring(0, 6)}...`}
                      {isCurrentUser && <span className="ml-2 text-xs bg-purple-600 px-2 py-0.5 rounded-full">You</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-300">{entry.xp} XP</div>
                      <div className="text-xs text-gray-400">Level {entry.level}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;