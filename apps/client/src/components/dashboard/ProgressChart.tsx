import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { UserProfile } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';

interface ProgressChartProps {
  user: UserProfile;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ user }) => {
  const { 
    getWeeklyXp, 
    getWeeklyGames, 
    getDayLabels, 
    getWeeklyTotalXp, 
    getAverageXpPerDay 
  } = useProgress();
  
  const weeklyXp = getWeeklyXp();
  const weeklyGames = getWeeklyGames();
  const dayLabels = getDayLabels();
  
  // Create weekly data from context
  const weeklyData = dayLabels.map((day, index) => ({
    day,
    xp: weeklyXp[index],
    games: weeklyGames[index]
  }));

  const maxXP = Math.max(...weeklyXp, 1); // Ensure we don't divide by zero

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-500" />
        <h3 className="text-lg font-bold text-white">Weekly Progress</h3>
      </div>

      <div className="space-y-4">
        {/* XP Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">XP Earned</span>
            <span className="text-sm text-green-400 font-medium">
              {getWeeklyTotalXp()} XP total
            </span>
          </div>
          
          <div className="flex items-end space-x-2 h-24">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${(day.xp / maxXP) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.xp} XP
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {weeklyData.map(day => (
              <span key={day.day}>{day.day}</span>
            ))}
          </div>
        </div>

        {/* Games Played */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Games Played</span>
            <span className="text-sm text-blue-400 font-medium">
              {weeklyGames.reduce((sum, games) => sum + games, 0)} games total
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="flex-1 text-center"
              >
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-xs text-blue-400 font-medium">{day.games}</span>
                </div>
                <span className="text-xs text-gray-400">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {getWeeklyTotalXp()}
              </div>
              <div className="text-xs text-gray-400">Total XP This Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {getAverageXpPerDay()}
              </div>
              <div className="text-xs text-gray-400">Average XP/Day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;