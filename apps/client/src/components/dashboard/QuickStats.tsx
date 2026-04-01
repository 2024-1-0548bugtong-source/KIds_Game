import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { UserProfile } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';

interface QuickStatsProps {
  user: UserProfile;
}

const QuickStats: React.FC<QuickStatsProps> = ({ user }) => {
  const { weeklyProgress, getTodayXp, getWeeklyGames } = useProgress();
  
  // Calculate next level XP requirement
  const nextLevelXp = user.level * 100;
  const xpToNextLevel = nextLevelXp - user.xp;
  
  // Get today's XP
  const todayXp = getTodayXp();
  
  // Get weekly games played
  const weeklyGamesPlayed = getWeeklyGames().reduce((sum, games) => sum + games, 0);
  
  // Get current streak
  const currentStreak = weeklyProgress?.currentStreak || 0;
  
  const stats = [
    {
      title: 'Total XP',
      value: user.xp,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      change: todayXp > 0 ? `+${todayXp} today` : 'No XP today'
    },
    {
      title: 'Current Level',
      value: user.level,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      change: `Next: ${xpToNextLevel} XP`
    },
    {
      title: 'Games Played',
      value: weeklyProgress?.totalGamesPlayed || 0,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      change: weeklyGamesPlayed > 0 ? `+${weeklyGamesPlayed} this week` : 'No games this week'
    },
    {
      title: 'Day Streak',
      value: currentStreak,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: currentStreak > 0 ? 'Keep it up!' : 'Start your streak!'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
              </div>
            </div>
            
            <div className="text-xs text-green-400 font-medium">
              {stat.change}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickStats;