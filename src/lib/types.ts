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
