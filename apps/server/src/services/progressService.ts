import { db } from '../config/firebase';
import { logger } from '../server';

// Interface for user progress data
interface UserProgress {
  xp: number;
  level: number;
  gamesPlayed: number;
  dayStreak: number;
  lastPlayed: string;
  levelProgress: number; // percent
  week: string;
  avatar?: string; // Optional avatar URL
}

// Interface for leaderboard entry
interface LeaderboardEntry {
  userId: string;
  xp: number;
  level: number;
  avatar?: string;
}

// Interface for progress update request
interface ProgressUpdateRequest {
  userId: string;
  xpEarned: number;
  gameResult?: any; // Optional game result data
}

// Utility to get current week string
function getWeekStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(
    ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7
  );
  return `${year}-W${week}`;
}

/**
 * Update user progress in Firestore
 * @param data Progress update data
 * @returns Promise with updated progress
 */
export async function updateUserProgress(data: ProgressUpdateRequest): Promise<UserProgress> {
  const { userId, xpEarned, gameResult } = data;
  const today = new Date().toISOString().slice(0, 10);
  const weekStr = getWeekStr();
  
  try {
    // Reference to user progress document
    const userRef = db.collection('userProgress').doc(userId);
    
    // Get current progress data
    const userDoc = await userRef.get();
    let progress: UserProgress;
    
    if (!userDoc.exists || (userDoc.data() as any)?.week !== weekStr) {
      // New week or new user
      progress = {
        xp: 0,
        level: 1,
        gamesPlayed: 0,
        dayStreak: 0,
        lastPlayed: '',
        levelProgress: 0,
        week: weekStr
      };
    } else {
      // Existing user with current week data
      progress = userDoc.data() as UserProgress;
    }
    
    // Only update on real activity (game played)
    progress.xp += xpEarned;
    progress.gamesPlayed += 1;
    
    // Level calculation (example: 100 XP per level)
    const newLevel = Math.floor(progress.xp / 100) + 1;
    progress.level = newLevel;
    progress.levelProgress = ((progress.xp % 100) / 100) * 100;
    
    // Day streak calculation
    if (progress.lastPlayed === today) {
      // Already played today, no streak update
    } else if (
      progress.lastPlayed &&
      new Date(today).getTime() - new Date(progress.lastPlayed).getTime() === 86400000
    ) {
      // Played yesterday, increment streak
      progress.dayStreak += 1;
    } else {
      // Missed a day or first play
      progress.dayStreak = 1;
    }
    
    progress.lastPlayed = today;
    progress.week = weekStr;
    
    // Write updated progress to Firestore with merge option
    await userRef.set(progress, { merge: true });
    
    logger.info(`Updated progress for user ${userId}: XP=${progress.xp}, Level=${progress.level}`);
    return progress;
  } catch (error) {
    logger.error(`Error updating progress for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get user progress from Firestore
 * @param userId User ID
 * @returns Promise with user progress
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    const userRef = db.collection('userProgress').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return userDoc.data() as UserProgress;
  } catch (error) {
    logger.error(`Error getting progress for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get top users by XP for leaderboard
 * @param limit Number of top users to retrieve (default: 10)
 * @returns Promise with array of leaderboard entries
 */
export async function getTopUsers(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    // Query userProgress collection, order by XP descending, limit to specified number
    const snapshot = await db.collection('userProgress')
      .orderBy('xp', 'desc')
      .limit(limit)
      .get();
    
    if (snapshot.empty) {
      logger.info('No users found for leaderboard');
      return [];
    }
    
    // Map documents to leaderboard entries
    const leaderboard: LeaderboardEntry[] = snapshot.docs.map(doc => {
      const data = doc.data() as UserProgress;
      return {
        userId: doc.id,
        xp: data.xp,
        level: data.level,
        avatar: data.avatar
      };
    });
    
    logger.info(`Retrieved ${leaderboard.length} users for leaderboard`);
    return leaderboard;
  } catch (error) {
    logger.error('Error getting top users for leaderboard:', error);
    throw error;
  }
}