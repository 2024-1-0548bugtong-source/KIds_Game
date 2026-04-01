# Game Learning Server

Express.js server with TypeScript, Firebase Firestore integration, and real-time progress tracking.

## Setup

```bash
npm install
```

## Development

### Using ts-node-dev (Recommended)
```bash
npm run dev
# or
npm start
```

### Using tsx (Alternative)
```bash
npm run dev:tsx
```

## Production

```bash
# Build the project
npm run build

# Serve the built files
npm run serve
```

## Scripts

- `npm run dev` - Start development server with hot reload (ts-node-dev)
- `npm run dev:tsx` - Start development server with hot reload (tsx)
- `npm run build` - Build TypeScript to JavaScript
- `npm run serve` - Serve the built JavaScript files
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode

## Features

- ✅ TypeScript support
- ✅ ESM modules
- ✅ Hot reload during development
- ✅ No experimental warnings
- ✅ Express.js framework
- ✅ Source maps for debugging
- ✅ Firebase Firestore integration for persistent data storage
- ✅ User progress tracking with XP, levels, and streaks
- ✅ Comprehensive test suite with Jest and ts-jest

## Port

The server runs on port 5000 by default.

## Firebase Setup

This project uses Firebase Firestore for persistent data storage. To set up Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore in your project
3. Generate a service account key from Project Settings > Service Accounts
4. Create a `.env` file based on `.env.example` and add your Firebase credentials

For detailed instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## API Endpoints

### Progress Tracking

- `POST /api/progress/update` - Update user progress with XP earned from activities
  ```json
  {
    "userId": "user123",
    "xpEarned": 10,
    "gameResult": {} // Optional game result data
  }
  ```

- `GET /api/progress/:userId` - Get user progress including XP, level, games played, and streaks

### Leaderboard

- `GET /api/leaderboard/top` - Get top users ranked by XP (default: top 10)
  - Query parameters:
    - `limit` - Number of users to return (optional, default: 10, max: 100)
  - Response:
  ```json
  {
    "success": true,
    "leaderboard": [
      {
        "userId": "user123",
        "xp": 500,
        "level": 5,
        "avatar": "https://example.com/avatar.png" // Optional
      },
      // More users...
    ]
  }
  ```

## Testing

Run tests with Jest:

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```