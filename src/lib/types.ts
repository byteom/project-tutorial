export interface SubTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export interface TutorialStep {
  id:string;
  title: string;
  description: string;
  content: string; // This will now be the content for the step's own page, if any.
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
}
