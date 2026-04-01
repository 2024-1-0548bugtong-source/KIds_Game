import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import winston from 'winston';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'game-learning-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Game Learning API'
  });
});

// Basic API endpoints for testing
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  // Mock login endpoint
  res.json({
    success: true,
    message: 'Login endpoint reached',
    data: {
      token: 'mock-jwt-token',
      user: {
        uid: 'mock-user-id',
        email: req.body.email,
        role: 'student'
      }
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  // Mock register endpoint
  res.json({
    success: true,
    message: 'Registration endpoint reached',
    data: {
      token: 'mock-jwt-token',
      user: {
        uid: 'mock-user-id',
        email: req.body.email,
        role: 'student'
      }
    }
  });
});

// Import Firebase and services
import './config/firebase';
import { updateUserProgress, getUserProgress, getTopUsers } from './services/progressService';
import { processQuestion, validateQuestion } from './services/chatbotService';


// Progress update endpoint (called on real activity)
app.post('/api/progress/update', async (req: Request, res: Response) => {
  try {
    const { userId, xpEarned, gameResult } = req.body;
    if (!userId || typeof xpEarned !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing userId or xpEarned' });
    }

    // Update progress in Firestore
    const progress = await updateUserProgress({
      userId,
      xpEarned,
      gameResult
    });

    return res.json({
      success: true,
      progress: {
        xp: progress.xp,
        level: progress.level,
        gamesPlayed: progress.gamesPlayed,
        dayStreak: progress.dayStreak,
        levelProgress: progress.levelProgress,
        week: progress.week
      }
    });
  } catch (error) {
    logger.error('Error in progress update endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

// Get user progress endpoint
app.get('/api/progress/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId' });
    }

    // Get progress from Firestore
    const progress = await getUserProgress(userId);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'No progress found for this user'
      });
    }

    return res.json({
      success: true,
      progress
    });
  } catch (error) {
    logger.error('Error in get progress endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get progress'
    });
  }
});

// Get top users for leaderboard
app.get('/api/leaderboard/top', async (req: Request, res: Response) => {
  try {
    // Get limit from query parameter or use default (10)
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid limit. Must be a number between 1 and 100.' 
      });
    }
    
    // Get top users from Firestore
    const leaderboard = await getTopUsers(limit);
    
    return res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    logger.error('Error in leaderboard endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve leaderboard'
    });
  }
});

// Chatbot endpoint
app.post('/api/chatbot/ask', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    // Validate input
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }
    
    // Sanitize and validate question
    const sanitizedQuestion = validateQuestion(question);
    if (!sanitizedQuestion) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question format or length'
      });
    }
    
    // Process question with Groq API
    const result = await processQuestion(sanitizedQuestion);
    
    return res.json(result);
  } catch (error) {
    logger.error('Error in chatbot endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process question'
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join-user-room', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Handle game progress updates
  socket.on('game-progress', (data: any) => {
    // Broadcast to all connected clients
    io.emit('game-progress-update', data);
  });

  // Handle leaderboard updates
  socket.on('leaderboard-update', (data: any) => {
    io.emit('leaderboard-refresh', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export { app, io, logger };
