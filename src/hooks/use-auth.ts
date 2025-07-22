
"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { createUserProfile, getUserProfile } from "@/lib/firestore-users";
import type { UserProfile } from "@/lib/types";


interface AuthContextType {
    user: (FirebaseUser & { profile: UserProfile | null }) | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export function useAuth() {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<AuthContextType['user']> => {
    let profile = await getUserProfile(firebaseUser.uid);
    if (!profile) {
      profile = await createUserProfile(firebaseUser);
    }
    if (profile.status === 'blocked') {
        throw new Error("Your account has been blocked.");
    }
    return { ...firebaseUser, profile };
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userWithProfile = await fetchUserProfile(firebaseUser);
          setUser(userWithProfile);
          if (window.location.pathname === '/auth') {
            router.replace('/project-practice');
          }
        } else {
          setUser(null);
        }
      } catch (err: any) {
         setError(err.message);
         setUser(null);
         await firebaseSignOut(auth); // Sign out the user from Firebase auth if their profile is blocked
         if (window.location.pathname !== '/auth') {
            router.replace("/auth"); // Redirect to auth page on error (e.g. blocked user)
         }
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, fetchUserProfile]);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user);
      // onIdTokenChanged will handle the rest
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onIdTokenChanged will handle the rest
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      router.replace('/auth');
    } catch (err: any) {
      setError(err.message);
    }
  }, [router]);

  return { user, loading, error, signIn, signUp, signOut };
}
