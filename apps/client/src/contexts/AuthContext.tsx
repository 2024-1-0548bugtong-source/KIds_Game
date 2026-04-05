import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { joinUserRoom } from '../services/socketService';

// Helper function to remove undefined properties from an object
const removeUndefinedProps = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// User types
export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  displayName?: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: string[];
  createdAt: Date;
  lastLoginAt: Date;
  standard?: number; // Add standard
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsGuest: (displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Local storage helpers for guest users
  const storeGuestUser = (user: UserProfile) => {
    localStorage.setItem('gamelearn_guest_user', JSON.stringify(user));
  };

  const getGuestUser = (): UserProfile | null => {
    const userStr = localStorage.getItem('gamelearn_guest_user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt)
      };
    } catch (error) {
      console.error('Error parsing guest user from localStorage:', error);
      return null;
    }
  };

  const removeGuestUser = () => {
    localStorage.removeItem('gamelearn_guest_user');
  };

  // Create guest profile (no Firebase)
  const createGuestProfile = (displayName?: string): UserProfile => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      uid: guestId,
      email: null,
      role: 'guest',
      displayName: displayName || 'Guest User',
      avatar: '👤',
      xp: 0,
      level: 1,
      badges: ['guest_mode'],
      createdAt: new Date(),
      lastLoginAt: new Date(),
      standard: undefined // initially undefined
    };
  };

  // Firebase user to UserProfile converter
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<UserProfile> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: userData.role || 'student',
        displayName: firebaseUser.displayName || userData.displayName,
        avatar: userData.avatar || '👤',
        xp: userData.xp || 0,
        level: userData.level || 1,
        badges: userData.badges || [],
        createdAt: userData.createdAt?.toDate() || new Date(),
        lastLoginAt: new Date(),
        standard: userData.standard // load standard
      };
    } else {
      // Create new user profile in Firestore
      const newUser: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: 'student',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        avatar: '👤',
        xp: 0,
        level: 1,
        badges: ['first_login'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        standard: undefined // initially undefined
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      
      return newUser;
    }
  };

  // Sign up with Firebase
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        role: 'student',
        displayName: displayName || user.displayName || 'New User',
        avatar: '👤',
        xp: 0,
        level: 1,
        badges: ['newbie'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      try {
        // Ensure we don't write undefined fields
        await setDoc(doc(db, 'users', user.uid), removeUndefinedProps(userProfile));
      } catch (firestoreError) {
        console.error("Error creating user document in Firestore:", firestoreError);
        // Optionally, you might want to delete the created user if Firestore fails
        // await user.delete();
        throw new Error("Failed to create user profile in the database.");
      }

    } catch (authError: any) {
      console.error("Detailed signup error:", authError);
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered.');
      }
      throw new Error(authError.message || 'An unknown error occurred during sign up.');
    }
  };

  // Sign in with Firebase
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the document doesn't exist, create it. This can happen if a user
        // was created in Auth but the Firestore doc creation failed.
        console.warn(`No Firestore document found for user ${user.uid}. Creating one now.`);
        const newUserProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          role: 'student', // Default role
          displayName: user.displayName || 'New User',
          avatar: '👤',
          xp: 0,
          level: 1,
          badges: ['newbie'],
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };
        await setDoc(userDocRef, removeUndefinedProps(newUserProfile));
        setCurrentUser(newUserProfile);
        joinUserRoom(user.uid);
      } else {
        // If it exists, just update the last login time.
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        });
      }

    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      }
      // Re-throw other errors to be caught by the form handler
      throw error;
    }
  };

  // Sign in as guest (no Firebase)
  const signInAsGuest = async (displayName?: string) => {
    try {
      setLoading(true);
      const user = createGuestProfile(displayName);
      setCurrentUser(user);
      storeGuestUser(user);
      
      // Join guest user's socket room for real-time updates
      joinUserRoom(user.uid);
      console.log('Welcome! You can explore as a guest. Sign up to save your progress! 👋');
    } catch (error: any) {
      console.error('Guest sign in error:', error);
      console.log('Failed to sign in as guest. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out (handles both Firebase and guest users)
  const signOut = async () => {
    try {
      if (currentUser?.role === 'guest') {
        // Guest user - just clear local storage
        setCurrentUser(null);
        removeGuestUser();
      } else {
        // Firebase user - sign out from Firebase
        await firebaseSignOut(auth);
        setCurrentUser(null);
      }
      console.log('Signed out successfully! 👋');
    } catch (error) {
      console.error('Sign out error:', error);
      console.log('Failed to sign out. Please try again.');
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      // Ensure we don't write undefined fields
      await updateDoc(userDocRef, removeUndefinedProps(updates));
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile.');
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || userData.displayName,
            });
            
            // Update last login time without saving undefined fields
            await updateDoc(userDocRef, {
              lastLoginAt: serverTimestamp()
            });

            joinUserRoom(user.uid);
          } else {
            // If the document doesn't exist, create it. This can happen if a user
            // was created in Auth but the Firestore doc creation failed.
            console.warn(`No Firestore document found for user ${user.uid}. Creating one now.`);
            const newUserProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              role: 'student', // Default role
              displayName: user.displayName || 'New User',
              avatar: '👤',
              xp: 0,
              level: 1,
              badges: ['newbie'],
              createdAt: new Date(),
              lastLoginAt: new Date(),
            };
            await setDoc(userDocRef, removeUndefinedProps(newUserProfile));
            setCurrentUser(newUserProfile);
            joinUserRoom(user.uid);
          }
        } else {
          // User is signed out
          const guest = getGuestUser();
          setCurrentUser(guest);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, signIn, signInAsGuest, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};