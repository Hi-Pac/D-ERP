import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from './types/user';
import { Timestamp } from 'firebase/firestore';

// إعدادات Firebase - يجب استبدالها بإعدادات مشروعك
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// مجموعة المستخدمين في Firestore
const usersCollection = collection(db, 'users');

// أنواع الأدوار
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES = 'sales',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

// تسجيل مستخدم جديد
const registerWithEmailAndPassword = async (
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole = UserRole.VIEWER
): Promise<UserCredential> => {
  try {
    // إنشاء المستخدم في Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // تحديث ملف التعريف
    await updateProfile(user, { displayName });
    
    // إنشاء مستند المستخدم في Firestore
    const userData: Partial<User> = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      emailVerified: user.emailVerified,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLoginAt: null,
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
    };
    
    await setDoc(doc(usersCollection, user.uid), userData);
    
    // إرسال بريد التحقق من البريد الإلكتروني
    await sendEmailVerification(user);
    
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// تسجيل الدخول
const loginWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // تحديث وقت آخر تسجيل دخول
    await updateDoc(doc(usersCollection, user.uid), {
      lastLoginAt: serverTimestamp(),
    });
    
    return userCredential;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// تسجيل الخروج
const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// تحديث ملف تعريف المستخدم
const updateUserProfile = async (
  userId: string, 
  updates: Partial<User>
): Promise<void> => {
  try {
    await updateDoc(doc(usersCollection, userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// تحميل صورة المستخدم
const uploadUserImage = async (userId: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // تحديث رابط الصورة في ملف تعريف المستخدم
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    // تحديث الصورة في Firebase Auth
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading user image:', error);
    throw error;
  }
};

// الحصول على بيانات المستخدم
const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(usersCollection, userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// تحديث كلمة المرور
const updateUserPassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('User not authenticated');
    }
    
    // إعادة المصادقة
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // تحديث كلمة المرور
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// تصدير الدوال والثوابت
export type { User } from './types/user';

export {
  db,
  auth,
  storage,
  app,
  usersCollection,
  UserRole,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  resetPassword,
  updateUserProfile,
  uploadUserImage,
  getUserData,
  updateUserPassword,
  onAuthStateChanged,
  EmailAuthProvider,
  serverTimestamp,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
};
