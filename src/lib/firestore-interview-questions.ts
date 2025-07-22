
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import type { InterviewQuestion } from "./types";

const QUESTIONS_COLLECTION = "interviewQuestions";

// Function to seed initial data if the collection is empty
export async function seedInitialQuestions() {
  const questionsRef = collection(db, QUESTIONS_COLLECTION);
  const snapshot = await getDocs(questionsRef);
  if (snapshot.empty) {
    console.log("No questions found, seeding initial data...");
    const initialQuestions: Omit<InterviewQuestion, 'id'>[] = [
        { question: "Discuss the significance of 'Big O' notation in software development.", category: 'Technical', type: 'General', difficulty: 'Easy' },
        { question: "Share a time you went above and beyond for a project.", category: 'Behavioral', type: 'General', difficulty: 'Easy' },
        { question: "Compare and contrast REST and GraphQL.", category: 'Technical', type: 'Backend', difficulty: 'Medium' },
        { question: "Describe a situation where you had a conflict with a coworker and how you handled it.", category: 'Behavioral', type: 'General', difficulty: 'Medium' },
        { question: "Explain database indexing and why it's important for performance.", category: 'Technical', type: 'Backend', difficulty: 'Hard' },
        { question: "What is the Virtual DOM and how does React use it to improve performance?", category: 'Technical', type: 'Frontend', difficulty: 'Medium' },
        { question: "Tell me about a time you failed. What did you learn from it?", category: 'Behavioral', type: 'General', difficulty: 'Medium' },
        { question: "How would you design a system like Twitter's news feed?", category: 'Technical', type: 'Full Stack', difficulty: 'Hard' },
    ];
    for (const q of initialQuestions) {
        await addDoc(questionsRef, q);
    }
    console.log("Seeding complete.");
  }
}

// Fetch all interview questions
export async function getInterviewQuestions(): Promise<InterviewQuestion[]> {
  // await seedInitialQuestions(); // Optionally seed data if collection is empty
  const q = query(collection(db, QUESTIONS_COLLECTION), orderBy("question"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as InterviewQuestion));
}

// Fetch a single interview question by its ID
export async function getInterviewQuestionById(id: string): Promise<InterviewQuestion | null> {
    const docRef = doc(db, QUESTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as InterviewQuestion;
    } else {
        console.warn(`No question found with id: ${id}`);
        return null;
    }
}


// Add a new interview question
export async function addInterviewQuestion(questionData: Omit<InterviewQuestion, 'id'>) {
    const questionsRef = collection(db, QUESTIONS_COLLECTION);
    const newDocRef = await addDoc(questionsRef, questionData);
    return newDocRef.id;
}
