import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch or create user profile
          const profileRef = doc(db, 'users', firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            setProfile(data);
          } else {
            // Default role for new users
            const isAgencyOwner = firebaseUser.email === 'jk2020.vtcc@gmail.com' || firebaseUser.email === 'admin@nextgenbuildlabs.com';
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: isAgencyOwner ? UserRole.SUPERADMIN : UserRole.CLIENT,
              displayName: firebaseUser.email === 'admin@nextgenbuildlabs.com' ? 'Jayakumar' : firebaseUser.displayName,
              active: 'active',
              createdAt: Date.now(),
            };
            await setDoc(profileRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          // We still want to stop loading even on error, but we log the specific Firestore error
          setLoading(false);
          handleFirestoreError(error, OperationType.GET, 'users/' + firebaseUser.uid);
          return;
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === UserRole.SUPERADMIN || profile?.role === UserRole.STAFF,
    isSuperAdmin: profile?.role === UserRole.SUPERADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
