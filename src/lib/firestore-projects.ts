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
import type { Project } from "./types";

export async function getUserProjects(userId: string): Promise<Project[]> {
  const q = query(collection(db, "projects"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Project);
}

export async function addUserProject(userId: string, project: Project) {
  await setDoc(doc(db, "projects", project.id), { ...project, userId });
}

export async function updateUserProject(userId: string, project: Project) {
  await updateDoc(doc(db, "projects", project.id), { ...project, userId });
}

export async function deleteUserProject(userId: string, projectId: string) {
  await deleteDoc(doc(db, "projects", projectId));
} 