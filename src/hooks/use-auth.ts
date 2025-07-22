
"use client";

import { useEffect, useState, useCallback } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Redirect only if they are on the auth page
        if (window.location.pathname === '/auth') {
          router.replace('/project-practice');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle redirect
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
      // onAuthStateChanged will handle redirect
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

  return { user, loading, error, signUp, signIn, signOut };
}
