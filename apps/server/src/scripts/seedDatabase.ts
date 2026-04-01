import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

// Sample user data
const sampleUsers = [
  {
    userId: 'user1',
    xp: 450,
    level: 5,
    gamesPlayed: 25,
    dayStreak: 3,
    lastPlayed: new Date().toISOString().slice(0, 10),
    levelProgress: 50,
    week: '2025-W30',
    avatar: '👨‍🎓'
  },
  {
    userId: 'user2',
    xp: 320,
    level: 4,
    gamesPlayed: 18,
    dayStreak: 2,
    lastPlayed: new Date().toISOString().slice(0, 10),
    levelProgress: 20,
    week: '2025-W30',
    avatar: '👩‍🎓'
  },
  {
    userId: 'user3',
    xp: 580,
    level: 6,
    gamesPlayed: 32,
    dayStreak: 5,
    lastPlayed: new Date().toISOString().slice(0, 10),
    levelProgress: 80,
    week: '2025-W30',
    avatar: '🧑‍🎓'
  },
  {
    userId: 'user4',
    xp: 210,
    level: 3,
    gamesPlayed: 12,
    dayStreak: 1,
    lastPlayed: new Date().toISOString().slice(0, 10),
    levelProgress: 10,
    week: '2025-W30',
    avatar: '👨‍🔬'
  },
  {
    userId: 'user5',
    xp: 680,
    level: 7,
    gamesPlayed: 40,
    dayStreak: 7,
    lastPlayed: new Date().toISOString().slice(0, 10),
    levelProgress: 80,
    week: '2025-W30',
    avatar: '👩‍🔬'
  }
];

// Seed the database
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Add sample users to userProgress collection one by one
    for (const user of sampleUsers) {
      const { userId, ...userData } = user;
      console.log(`Adding user ${userId} to database...`);
      
      try {
        // Set the document directly without using batch
        await db.collection('userProgress').doc(userId).set(userData);
        console.log(`Successfully added user ${userId}`);
      } catch (userError) {
        console.error(`Error adding user ${userId}:`, userError);
      }
    }
    
    console.log('Database seeding completed!');
    console.log(`Attempted to add ${sampleUsers.length} sample users to the userProgress collection.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();