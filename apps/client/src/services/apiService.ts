/**
 * API Service for making requests to the backend
 */

// Default API URL from environment variable or localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Leaderboard interfaces
export interface LeaderboardEntry {
  userId: string;
  xp: number;
  level: number;
  avatar?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  error?: string;
}

/**
 * Fetch top users for the leaderboard
 * @param limit Number of users to retrieve (default: 10)
 * @returns Promise with leaderboard data
 */
export const fetchLeaderboard = async (limit: number = 10): Promise<LeaderboardResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/leaderboard/top?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return {
      success: false,
      leaderboard: [],
      error: error instanceof Error ? error.message : 'Failed to load leaderboard'
    };
  }
};

// Progress interfaces
export interface UserProgress {
  xp: number;
  level: number;
  gamesPlayed: number;
  dayStreak: number;
  levelProgress: number;
  week: Record<string, any>;
}

export interface ProgressResponse {
  success: boolean;
  progress?: UserProgress;
  error?: string;
}

/**
 * Fetch user progress
 * @param userId User ID
 * @returns Promise with user progress data
 */
export const fetchUserProgress = async (userId: string): Promise<ProgressResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/progress/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch progress: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load progress'
    };
  }
};

/**
 * Update user progress
 * @param userId User ID
 * @param xpEarned XP earned
 * @param gameResult Optional game result data
 * @returns Promise with updated progress data
 */
export const updateUserProgress = async (
  userId: string,
  xpEarned: number,
  gameResult?: any
): Promise<ProgressResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/progress/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        xpEarned,
        gameResult
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update progress: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress'
    };
  }
};