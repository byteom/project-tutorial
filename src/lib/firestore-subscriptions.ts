
'use server';

import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { Subscription } from "./types";

export async function getUserSubscription(userId: string): Promise<Subscription> {
  const ref = doc(db, "subscriptions", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as Subscription;
  }
  // If no subscription document exists, default to free plan
  const defaultSubscription: Subscription = {
      userId,
      status: 'free',
      plan: 'free_tier',
  };
  // Save the default subscription for the user
  await setUserSubscription(userId, defaultSubscription);
  return defaultSubscription;
}

export async function setUserSubscription(userId: string, data: Subscription) {
  await setDoc(doc(db, "subscriptions", userId), data, { merge: true });
}

export async function updateUserSubscription(userId: string, data: Partial<Subscription>) {
    const subRef = doc(db, "subscriptions", userId);
    // Use setDoc with merge to create the doc if it doesn't exist, or update it if it does.
    await setDoc(subRef, data, { merge: true });
}
