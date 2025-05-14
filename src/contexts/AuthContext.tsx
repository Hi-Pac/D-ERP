import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  UserCredential,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  sendPasswordResetEmail as sendFirebasePasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  auth, 
  db, 
  usersCollection, 
  registerWithEmailAndPassword, 
  loginWithEmailAndPassword, 
  logout, 
  resetPassword,
  updateUserProfile,
  uploadUserImage,
  getUserData,
  updateUserPassword,
  User,
  UserRole
} from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, displayName: string, role?: UserRole) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  reauthenticate: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(usersCollection, firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrentUser({
            ...userData,
            uid: firebaseUser.uid,
            email: firebaseUser.email || userData.email,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL || userData.photoURL,
          });
          setIsAdmin(userData.role === UserRole.ADMIN);
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: UserRole.VIEWER,
            emailVerified: firebaseUser.emailVerified,
            isActive: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLoginAt: null,
            photoURL: firebaseUser.photoURL || '',
          };
          
          await setDoc(doc(usersCollection, firebaseUser.uid), newUser);
          setCurrentUser(newUser);
        }
        
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return await loginWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, displayName: string, role: UserRole = UserRole.VIEWER) => {
    return await registerWithEmailAndPassword(email, password, displayName, role);
  };

  const signOut = async () => {
    await logout();
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    // Update Firebase Auth profile if displayName or photoURL is being updated
    if (updates.displayName || updates.photoURL) {
      await updateFirebaseProfile(auth.currentUser!, {
        displayName: updates.displayName || currentUser.displayName,
        photoURL: updates.photoURL || currentUser.photoURL,
      });
    }
    
    // Update Firestore user document
    await updateUserProfile(currentUser.uid, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    // Update local state
    setCurrentUser({
      ...currentUser!,
      ...updates,
    });
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(auth.currentUser.email!, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update email in Firebase Auth
    await updateFirebaseEmail(auth.currentUser, newEmail);
    
    // Update email in Firestore
    await updateUserProfile(auth.currentUser.uid, {
      email: newEmail,
      updatedAt: Timestamp.now(),
    });
    
    // Update local state
    setCurrentUser({
      ...currentUser!,
      email: newEmail,
    });
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update password in Firebase Auth
    await updateFirebasePassword(auth.currentUser, newPassword);
  };

  const resetPassword = async (email: string) => {
    await resetPassword(email);
  };

  const uploadProfileImage = async (file: File) => {
    if (!currentUser) throw new Error('User not authenticated');
    return await uploadUserImage(currentUser.uid, file);
  };

  const reauthenticate = async (password: string) => {
    if (!auth.currentUser?.email) throw new Error('User not authenticated');
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const value = {
    currentUser,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    signOut,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
    uploadProfileImage,
    reauthenticate,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthContext;
