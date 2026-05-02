'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { useAppStore } from '@/store/useAppStore';
import { syncFromRemote } from '@/lib/sync';
import { initJourneyIfEmpty } from '@/engine/initJourney';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearProfile } = useAppStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        syncFromRemote(u.uid)
          .catch(() => {})
          .finally(() => {
            // Ensure journey exists after sync (or sync failure)
            initJourneyIfEmpty();
          });
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      clearProfile();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, login, loginWithGoogle, logout };
}
