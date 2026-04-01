import React from 'react';
import { motion } from 'framer-motion';

interface BadgeDisplayProps {
  badges: string[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  const badgeData = [
    { id: 'first_login', name: 'First Steps', icon: '👣', description: 'Completed your first login' },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', description: 'Tried 5 different games' },
    { id: 'first_game', name: 'Game Master', icon: '🎮', description: 'Completed your first game' },
    { id: 'perfect_score', name: 'Perfect Score', icon: '💯', description: 'Got 100% on a game' },
    { id: 'guest_mode', name: 'Guest Explorer', icon: '👤', description: 'Explored as a guest' },
    { id: 'streak_3', name: 'Consistent Learner', icon: '🔥', description: '3-day learning streak' },
    { id: 'streak_7', name: 'Dedicated Student', icon: '⭐', description: '7-day learning streak' },
    { id: 'level_5', name: 'Level Up', icon: '📈', description: 'Reached level 5' },
    { id: 'level_10', name: 'Master Learner', icon: '👑', description: 'Reached level 10' },
    { id: 'math_whiz', name: 'Math Whiz', icon: '🧮', description: 'Completed 10 math games' },
    { id: 'science_expert', name: 'Science Expert', icon: '🔬', description: 'Completed 10 science games' },
    { id: 'language_arts', name: 'Language Arts', icon: '📚', description: 'Completed 10 language games' }
  ];

  const userBadges = badgeData.filter(badge => badges.includes(badge.id));

  if (userBadges.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🏆</div>
        <p className="text-gray-400 text-sm">No badges earned yet</p>
        <p className="text-gray-500 text-xs mt-1">Complete games and challenges to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {userBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-xl">
            {badge.icon}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium text-sm">{badge.name}</h4>
            <p className="text-gray-400 text-xs">{badge.description}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
        </motion.div>
      ))}
      
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          {userBadges.length} of {badgeData.length} badges earned
        </p>
      </div>
    </div>
  );
};

export default BadgeDisplay; 