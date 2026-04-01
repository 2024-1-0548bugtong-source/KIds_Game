/**
 * Socket.IO service for real-time communication with the server
 */
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

// Default API URL from environment variable or localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Socket instance
let socket: typeof Socket | null = null;

/**
 * Initialize socket connection
 * @returns Socket instance
 */
export const initializeSocket = (): typeof Socket => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

/**
 * Join user's personal room for targeted updates
 * @param userId User ID
 */
export const joinUserRoom = (userId: string): void => {
  if (!socket) {
    socket = initializeSocket();
  }

  socket.emit('join-user-room', userId);
};

/**
 * Listen for leaderboard updates
 * @param callback Function to call when leaderboard updates are received
 * @returns Function to remove the listener
 */
export const onLeaderboardUpdate = (callback: (data: any) => void): (() => void) => {
  if (!socket) {
    socket = initializeSocket();
  }

  socket.on('leaderboard-refresh', callback);

  return () => {
    socket?.off('leaderboard-refresh', callback);
  };
};

/**
 * Listen for game progress updates
 * @param callback Function to call when progress updates are received
 * @returns Function to remove the listener
 */
export const onGameProgressUpdate = (callback: (data: any) => void): (() => void) => {
  if (!socket) {
    socket = initializeSocket();
  }

  socket.on('game-progress-update', callback);

  return () => {
    socket?.off('game-progress-update', callback);
  };
};

/**
 * Emit a leaderboard update event
 * @param data Update data
 */
export const emitLeaderboardUpdate = (data: any): void => {
  if (!socket) {
    socket = initializeSocket();
  }

  socket.emit('leaderboard-update', data);
};

/**
 * Emit a game progress update event
 * @param data Update data
 */
export const emitGameProgressUpdate = (data: any): void => {
  if (!socket) {
    socket = initializeSocket();
  }

  socket.emit('game-progress', data);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};