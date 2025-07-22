export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface TutorialStep {
  id:string;
  title: string;
  description: string;
  content: string;
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
