
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { InterviewAnswer } from "./types";

export async function getUserInterviewAnswers(userId: string): Promise<InterviewAnswer[]> {
  const q = query(
    collection(db, "interviewAnswers"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as InterviewAnswer);
}

export async function addInterviewAnswer(userId: string, answerData: Omit<InterviewAnswer, 'userId'>) {
  const answerWithUser = { ...answerData, userId };
  await setDoc(doc(db, "interviewAnswers", answerData.id), answerWithUser);
}
