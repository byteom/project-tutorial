export interface TutorialStep {
  id: string;
  title: string;
  content: string;
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
