
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from "./types";
import type { User } from "firebase/auth";

const USERS_COLLECTION = "users";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
}

export async function createUserProfile(user: User): Promise<UserProfile> {
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    roles: ['user'], // Default role
  };
  await setDoc(doc(db, USERS_COLLECTION, user.uid), userProfile);
  return userProfile;
}
