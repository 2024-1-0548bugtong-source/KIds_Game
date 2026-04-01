# Firebase Setup for Progress Tracking

## Overview
This project uses Firebase Firestore to store and manage user progress data. The implementation replaces the previous in-memory storage with a persistent database solution that ensures data is preserved across server restarts and can scale with user growth.

## Setup Instructions

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Firestore Database in your project

### 2. Generate Service Account Credentials
1. In your Firebase project, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely

### 3. Configure Environment Variables
1. Create a `.env` file in the server root directory based on `.env.example`
2. Add the following Firebase-specific variables from your service account JSON:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   ```

## Data Structure

The user progress data is stored in Firestore with the following structure:

```
Collection: userProgress
  Document ID: {userId}
    Fields:
      - xp: number
      - level: number
      - gamesPlayed: number
      - dayStreak: number
      - lastPlayed: string (ISO date)
      - levelProgress: number (percentage)
      - week: string (format: "YYYY-WXX")
```

## API Endpoints

### Update Progress
- **URL**: `/api/progress/update`
- **Method**: POST
- **Body**:
  ```json
  {
    "userId": "user123",
    "xpEarned": 10,
    "gameResult": {} // Optional game result data
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "progress": {
      "xp": 150,
      "level": 2,
      "gamesPlayed": 15,
      "dayStreak": 3,
      "levelProgress": 50,
      "week": "2023-W45"
    }
  }
  ```

### Get Progress
- **URL**: `/api/progress/:userId`
- **Method**: GET
- **Response**:
  ```json
  {
    "success": true,
    "progress": {
      "xp": 150,
      "level": 2,
      "gamesPlayed": 15,
      "dayStreak": 3,
      "lastPlayed": "2023-11-10",
      "levelProgress": 50,
      "week": "2023-W45"
    }
  }
  ```

### Get Leaderboard
- **URL**: `/api/leaderboard/top`
- **Method**: GET
- **Query Parameters**:
  - `limit`: Number of users to return (optional, default: 10, max: 100)
- **Response**:
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
      {
        "userId": "user456",
        "xp": 350,
        "level": 4
      }
      // More users...
    ]
  }
  ```

## Implementation Details

- The Firebase Admin SDK is initialized in `config/firebase.ts`
- Progress data operations are handled in `services/progressService.ts`
- The API endpoints in `server.ts` use these services to interact with Firestore
- All writes use `merge: true` to ensure safe updates
- Progress is only updated when real activity occurs (games played)
- Leaderboard functionality uses Firestore queries with ordering and limits
- The leaderboard endpoint is optimized to return only necessary user data (userId, XP, level, avatar)