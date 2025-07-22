
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
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

export async function addOrUpdateInterviewAnswer(userId: string, answerData: Omit<InterviewAnswer, 'userId' | 'id'>) {
    const q = query(
        collection(db, "interviewAnswers"),
        where("userId", "==", userId),
        where("questionId", "==", answerData.questionId),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        // No existing answer, create a new one
        const newId = `${userId}-${answerData.questionId}-${Date.now()}`;
        const newAnswer: InterviewAnswer = { ...answerData, id: newId, userId };
        await setDoc(doc(db, "interviewAnswers", newId), newAnswer);
    } else {
        // Existing answer found, update it
        const existingDoc = snapshot.docs[0];
        await updateDoc(doc(db, "interviewAnswers", existingDoc.id), {
            ...answerData, // Update with new data
            createdAt: Date.now(), // Update timestamp
        });
    }
}
