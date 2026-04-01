import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { joinUserRoom } from '../services/socketService';

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
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name in Firebase Auth
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Convert to UserProfile and save to Firestore
      const userProfile = await convertFirebaseUser(userCredential.user);
      setCurrentUser(userProfile);
      
      // Join user's socket room for real-time updates
      joinUserRoom(userProfile.uid);
      
      console.log('Account created successfully! Welcome to GameLearn! 🎮');
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      console.log(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Firebase
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await convertFirebaseUser(userCredential.user);
      setCurrentUser(userProfile);
      
      console.log('Welcome back! 🎉');
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Invalid email or password';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      console.log(errorMessage);
      throw error;
    } finally {
      setLoading(false);
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
    
    try {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      
      if (currentUser.role === 'guest') {
        // Guest user - update local storage
        storeGuestUser(updatedUser);
      } else {
        // Firebase user - update Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updatedUser,
          lastLoginAt: new Date()
        }, { merge: true });
      }
      
      console.log('Profile updated successfully! ✨');
    } catch (error) {
      console.error('Update profile error:', error);
      console.log('Failed to update profile. Please try again.');
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, checking for guest user');
        const guestUser = getGuestUser();
        if (guestUser) {
          setCurrentUser(guestUser);
        }
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          clearTimeout(loadingTimeout); // Clear timeout if Firebase responds
          
          if (firebaseUser) {
            // Firebase user signed in
            const userProfile = await convertFirebaseUser(firebaseUser);
            setCurrentUser(userProfile);
            
            // Join user's socket room for real-time updates
            joinUserRoom(userProfile.uid);
          } else {
            // Check for guest user in localStorage
            const guestUser = getGuestUser();
            if (guestUser) {
              setCurrentUser(guestUser);
            } else {
              setCurrentUser(null);
            }
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Fallback to guest user if Firebase fails
          const guestUser = getGuestUser();
          if (guestUser) {
            setCurrentUser(guestUser);
          } else {
            setCurrentUser(null);
          }
        } finally {
          setLoading(false);
        }
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up Firebase auth listener:', error);
      clearTimeout(loadingTimeout);
      // If Firebase fails completely, check for guest user
      const guestUser = getGuestUser();
      if (guestUser) {
        setCurrentUser(guestUser);
      }
      setLoading(false);
    }
  }, [loading]);

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInAsGuest,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};