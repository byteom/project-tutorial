
import type { InterviewQuestion } from './types';

// This file is now deprecated and questions are fetched from Firestore.
// It is kept for reference or potential fallback scenarios.
export const interviewQuestions: InterviewQuestion[] = [
    {
        id: 'big-o-notation',
        question: "Discuss the significance of 'Big O' notation in software development.",
        category: 'Technical',
        type: 'General',
        difficulty: 'Easy',
    },
    {
        id: 'above-and-beyond',
        question: "Share a time you went above and beyond for a project.",
        category: 'Behavioral',
        type: 'General',
        difficulty: 'Easy',
    },
    {
        id: 'rest-vs-graphql',
        question: "Compare and contrast REST and GraphQL.",
        category: 'Technical',
        type: 'Backend',
        difficulty: 'Medium',
    },
    {
        id: 'handling-conflict',
        question: "Describe a situation where you had a conflict with a coworker and how you handled it.",
        category: 'Behavioral',
        type: 'General',
        difficulty: 'Medium',
    },
    {
        id: 'database-indexing',
        question: "Explain database indexing and why it's important for performance.",
        category: 'Technical',
        type: 'Backend',
        difficulty: 'Hard',
    },
    {
        id: 'react-virtual-dom',
        question: "What is the Virtual DOM and how does React use it to improve performance?",
        category: 'Technical',
        type: 'Frontend',
        difficulty: 'Medium',
    },
    {
        id: 'handling-failure',
        question: "Tell me about a time you failed. What did you learn from it?",
        category: 'Behavioral',
        type: 'General',
        difficulty: 'Medium',
    },
    {
        id: 'system-design-twitter',
        question: "How would you design a system like Twitter's news feed?",
        category: 'Technical',
        type: 'Full Stack',
        difficulty: 'Hard',
    }
];
