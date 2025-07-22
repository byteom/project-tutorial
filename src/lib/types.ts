
export interface SubTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    content?: string; // Content is now optional and will be loaded on demand.
}

export interface TutorialStep {
  id:string;
  title: string;
  description: string;
  subTasks: SubTask[];
  completed: boolean;
}

export interface Project {
  id: string;
  title:string;
  description: string;
  image: string;
  dataAiHint?: string;
  steps: TutorialStep[];
  tags?: string[];
  skills?: string[];
  simulationDiagram?: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  description: string;
  content?: string; // Content is now optional and will be loaded on demand
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: LearningLesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  introduction: string;
  modules: LearningModule[];
  difficulty: string;
  topic: string;
}

export interface Subscription {
    userId: string;
    status: 'free' | 'pro';
    plan: string;
    subscriptionId?: string; // e.g., from a payment provider
    trial_end?: number; // timestamp
    current_period_end?: number; // timestamp
}

import type { GenerateInterviewFeedbackOutput } from "@/ai/flows/generate-interview-feedback";

export interface InterviewAnswer {
  id: string;
  userId: string;
  questionId: string;
  question: string;
  answer: string;
  feedback: GenerateInterviewFeedbackOutput;
  createdAt: number; // Timestamp
  transcript?: string;
}

export type InterviewQuestion = {
    id: string;
    question: string;
    category: 'Behavioral' | 'Technical';
    type: 'General' | 'Backend' | 'Frontend' | 'Full Stack' | 'DevOps';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    company?: string;
    tags?: string[];
};
