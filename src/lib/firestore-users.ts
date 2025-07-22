
'use server';

import { db } from "./firebase";
import { doc, getDoc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import type { UserProfile } from "./types";
import type { User } from "firebase/auth";

const USERS_COLLECTION = "users";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), uid: docSnap.id } as UserProfile;
  } else {
    return null;
  }
}

export async function createUserProfile(user: User): Promise<UserProfile> {
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    roles: ['user'], // Default role
    status: 'active', // Default status
    createdAt: Date.now(),
  };
  await setDoc(doc(db, USERS_COLLECTION, user.uid), userProfile);
  return userProfile;
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, data);
}
