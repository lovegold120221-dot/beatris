import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import localConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || localConfig.measurementId,
};

console.log('Firebase Init Details:', {
  hasApiKey: !!firebaseConfig.apiKey,
  keyPrefix: firebaseConfig.apiKey?.substring(0, 5),
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

// Scopes for Google Services Integration
// NOTE: Requesting highly sensitive scopes like full Gmail or Drive access will
// IMMEDIATELY cause an 'auth/internal-error' if they have not been explicitly 
// added to your Google Cloud Console OAuth Consent screen. 
// We have temporarily disabled them to allow you to log in. 
// googleProvider.addScope('https://mail.google.com/'); 
// googleProvider.addScope('https://www.googleapis.com/auth/drive'); 
// googleProvider.addScope('https://www.googleapis.com/auth/documents'); 
// googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets'); 
// googleProvider.addScope('https://www.googleapis.com/auth/presentations'); 
// googleProvider.addScope('https://www.googleapis.com/auth/calendar'); 
// googleProvider.addScope('https://www.googleapis.com/auth/contacts');

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(err: unknown, operationType: FirestoreErrorInfo['operationType'], path: string | null): never {
  if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
    const currentUser = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: err.message,
      operationType,
      path,
      authInfo: {
        userId: currentUser?.uid || '',
        email: currentUser?.email || '',
        emailVerified: currentUser?.emailVerified || false,
        isAnonymous: currentUser?.isAnonymous || false,
        providerInfo: currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw err;
}
