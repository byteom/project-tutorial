
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getUserTokenUsage(userId: string): Promise<{ count: number; lastUpdated: number }> {
  const ref = doc(db, "tokenUsage", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as { count: number; lastUpdated: number };
  }
  return { count: 0, lastUpdated: Date.now() };
}

export async function setUserTokenUsage(userId: string, data: { count: number; lastUpdated: number }) {
  await setDoc(doc(db, "tokenUsage", userId), data);
}
