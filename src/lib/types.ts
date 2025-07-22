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
}
