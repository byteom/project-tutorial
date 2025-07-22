
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
