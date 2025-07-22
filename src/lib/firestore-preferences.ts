
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserPreferences {
  operatingSystem?: "Windows" | "macOS" | "Linux";
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const ref = doc(db, "preferences", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserPreferences;
  }
  return {};
}

export async function setUserPreferences(userId: string, data: UserPreferences) {
  await setDoc(doc(db, "preferences", userId), data, { merge: true });
}
