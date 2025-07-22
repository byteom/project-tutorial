import { useEffect, useState, useCallback } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
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
        router.replace("/project-practice");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/project-practice");
    } catch (err: any) {
      setError(err.message);
    }
  }, [router]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/project-practice");
    } catch (err: any) {
      setError(err.message);
    }
  }, [router]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/project-practice");
    } catch (err: any) {
      setError(err.message);
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return { user, loading, error, signUp, signIn, signInWithGoogle, signOut };
} 