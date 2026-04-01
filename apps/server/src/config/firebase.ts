import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Check if Firebase is already initialized to prevent multiple initializations
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin with service account credentials
    // For production, use environment variables or secret management
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
  }
}

// Export Firestore instance for use in other files
export const db = admin.firestore();
export default admin;