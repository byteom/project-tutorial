import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import type { LearningPath } from "./types";

export async function getUserLearningPaths(userId: string): Promise<LearningPath[]> {
  const q = query(collection(db, "learningPaths"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as LearningPath);
}

export async function addUserLearningPath(userId: string, learningPath: LearningPath) {
  await setDoc(doc(db, "learningPaths", learningPath.id), { ...learningPath, userId });
}

export async function updateUserLearningPath(userId: string, learningPath: LearningPath) {
    await updateDoc(doc(db, "learningPaths", learningPath.id), { ...learningPath, userId });
}

export async function deleteUserLearningPath(userId: string, learningPathId: string) {
  await deleteDoc(doc(db, "learningPaths", learningPathId));
}
