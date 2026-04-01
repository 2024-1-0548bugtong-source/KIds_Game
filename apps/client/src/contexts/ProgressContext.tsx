import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, UserProfile } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { emitLeaderboardUpdate } from '../services/socketService';

// Weekly progress tracking types
interface DailyProgress {
  date: string; // ISO date string (YYYY-MM-DD)
  xp: number;
  gamesPlayed: number;
  gamesCompleted: number;
  activeDayStreak: boolean;
}

interface WeeklyProgress {
  startDate: string; // ISO date string of the week's start (YYYY-MM-DD)
  days: Record<string, DailyProgress>; // Map of ISO date strings to daily progress
  totalXp: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

interface ProgressContextType {
  weeklyProgress: WeeklyProgress | null;
  isLoading: boolean;
  recordActivity: (activity: {
    xpEarned?: number;
    gamePlayed?: boolean;
    gameCompleted?: boolean;
  }) => Promise<void>;
  getWeeklyXp: () => number[];
  getWeeklyGames: () => number[];
  getDayLabels: () => string[];
  getTodayXp: () => number;
  getWeeklyTotalXp: () => number;
  getAverageXpPerDay: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
  user?: UserProfile; // Optional user prop for component-level providers
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children, user }) => {
  const authContext = useAuth();
  const { updateUserProfile } = authContext;
  
  // Use provided user or get from auth context
  const currentUser = user || authContext.currentUser;
  
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions
  const getStartOfWeek = (date: Date): string => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const getTodayISODate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const createEmptyWeeklyProgress = (): WeeklyProgress => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const days: Record<string, DailyProgress> = {};
    
    // Create empty records for each day of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];
      days[dayStr] = {
        date: dayStr,
        xp: 0,
        gamesPlayed: 0,
        gamesCompleted: 0,
        activeDayStreak: false
      };
    }

    return {
      startDate: startOfWeek,
      days,
      totalXp: 0,
      totalGamesPlayed: 0,
      totalGamesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  };

  // Local storage helpers for guest users
  const storeGuestProgress = (progress: WeeklyProgress) => {
    localStorage.setItem('gamelearn_guest_progress', JSON.stringify(progress));
  };

  const getGuestProgress = (): WeeklyProgress | null => {
    const progressStr = localStorage.getItem('gamelearn_guest_progress');
    if (!progressStr) return null;
    try {
      return JSON.parse(progressStr);
    } catch (error) {
      console.error('Error parsing guest progress from localStorage:', error);
      return null;
    }
  };

  // Load progress data
  useEffect(() => {
    const loadProgressData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let progress: WeeklyProgress | null = null;
        const today = new Date();
        const currentWeekStart = getStartOfWeek(today);

        if (currentUser.role === 'guest') {
          // Guest user - load from localStorage
          progress = getGuestProgress();
        } else {
          // Firebase user - load from Firestore
          const progressDoc = await getDoc(doc(db, 'progress', currentUser.uid));
          if (progressDoc.exists()) {
            progress = progressDoc.data() as WeeklyProgress;
          }
        }

        // If no progress data or it's from a different week, create new
        if (!progress || progress.startDate !== currentWeekStart) {
          progress = createEmptyWeeklyProgress();
        }

        setWeeklyProgress(progress);
      } catch (error) {
        console.error('Error loading progress data:', error);
        // Create empty progress as fallback
        setWeeklyProgress(createEmptyWeeklyProgress());
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [currentUser]);

  // Record user activity (XP earned, games played, etc.)
  const recordActivity = async (activity: {
    activityType?: string; // Type of activity (quiz, puzzle, etc.)
    xpEarned?: number;
    gamePlayed?: boolean;
    completed?: boolean;
    perfectScore?: boolean;
  }) => {
    if (!currentUser || !weeklyProgress) return;

    try {
      const today = getTodayISODate();
      const updatedProgress = { ...weeklyProgress };
      const todayProgress = updatedProgress.days[today] || {
        date: today,
        xp: 0,
        gamesPlayed: 0,
        gamesCompleted: 0,
        activeDayStreak: false
      };

      // Update today's progress
      const xpEarned = activity.xpEarned || 0;
      const gamePlayed = activity.gamePlayed || activity.activityType ? 1 : 0;
      const gameCompleted = activity.completed ? 1 : 0;

      todayProgress.xp += xpEarned;
      todayProgress.gamesPlayed += gamePlayed;
      todayProgress.gamesCompleted += gameCompleted;
      todayProgress.activeDayStreak = true;

      // Update weekly totals
      updatedProgress.totalXp += xpEarned;
      updatedProgress.totalGamesPlayed += gamePlayed;
      updatedProgress.totalGamesCompleted += gameCompleted;
      updatedProgress.days[today] = todayProgress;

      // Update streak
      let streak = 0;
      const dates = Object.keys(updatedProgress.days).sort();
      for (let i = dates.length - 1; i >= 0; i--) {
        if (updatedProgress.days[dates[i]].activeDayStreak) {
          streak++;
        } else {
          break;
        }
      }
      updatedProgress.currentStreak = streak;
      updatedProgress.longestStreak = Math.max(updatedProgress.longestStreak, streak);

      // Save updated progress
      setWeeklyProgress(updatedProgress);

      // Update user profile with new XP and potentially new level
      if (xpEarned > 0) {
        const newXp = currentUser.xp + xpEarned;
        const newLevel = Math.floor(newXp / 100) + 1; // Simple level calculation
        
        // Check if user leveled up
        const leveledUp = newLevel > currentUser.level;
        
        // Create updated user profile
        const updatedProfile = {
          xp: newXp,
          level: newLevel,
          badges: updateBadges(currentUser.badges, {
            leveledUp,
            streak,
            gameCompleted: activity.completed || false
          })
        };
        
        // Update user profile
        await updateUserProfile(updatedProfile);
        
        // Emit leaderboard update event
        emitLeaderboardUpdate({
          userId: currentUser.uid,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          xp: newXp,
          level: newLevel
        });
      }

      // Save progress data
      if (currentUser.role === 'guest') {
        // Guest user - save to localStorage
        storeGuestProgress(updatedProgress);
      } else {
        // Firebase user - save to Firestore
        await setDoc(doc(db, 'progress', currentUser.uid), updatedProgress);
      }
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  // Helper to update badges based on achievements
  const updateBadges = (currentBadges: string[], achievements: {
    leveledUp: boolean;
    streak: number;
    gameCompleted: boolean;
  }): string[] => {
    const newBadges = [...currentBadges];
    
    // Add badges based on achievements
    if (achievements.gameCompleted && !newBadges.includes('first_game')) {
      newBadges.push('first_game');
    }
    
    if (achievements.streak >= 3 && !newBadges.includes('streak_3')) {
      newBadges.push('streak_3');
    }
    
    if (achievements.streak >= 7 && !newBadges.includes('streak_7')) {
      newBadges.push('streak_7');
    }
    
    if (achievements.leveledUp) {
      const level = currentUser?.level || 1;
      if (level >= 5 && !newBadges.includes('level_5')) {
        newBadges.push('level_5');
      }
      if (level >= 10 && !newBadges.includes('level_10')) {
        newBadges.push('level_10');
      }
    }
    
    return newBadges;
  };

  // Helper functions for UI components
  const getWeeklyXp = (): number[] => {
    if (!weeklyProgress) return [0, 0, 0, 0, 0, 0, 0];
    
    const result: number[] = [];
    const startDate = new Date(weeklyProgress.startDate);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];
      result.push(weeklyProgress.days[dayStr]?.xp || 0);
    }
    
    return result;
  };

  const getWeeklyGames = (): number[] => {
    if (!weeklyProgress) return [0, 0, 0, 0, 0, 0, 0];
    
    const result: number[] = [];
    const startDate = new Date(weeklyProgress.startDate);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];
      result.push(weeklyProgress.days[dayStr]?.gamesPlayed || 0);
    }
    
    return result;
  };

  const getDayLabels = (): string[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days;
  };

  const getTodayXp = (): number => {
    if (!weeklyProgress) return 0;
    const today = getTodayISODate();
    return weeklyProgress.days[today]?.xp || 0;
  };

  const getWeeklyTotalXp = (): number => {
    return weeklyProgress?.totalXp || 0;
  };

  const getAverageXpPerDay = (): number => {
    if (!weeklyProgress) return 0;
    const xpValues = Object.values(weeklyProgress.days).map(day => day.xp);
    const sum = xpValues.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / 7);
  };

  const value: ProgressContextType = {
    weeklyProgress,
    isLoading,
    recordActivity,
    getWeeklyXp,
    getWeeklyGames,
    getDayLabels,
    getTodayXp,
    getWeeklyTotalXp,
    getAverageXpPerDay
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};