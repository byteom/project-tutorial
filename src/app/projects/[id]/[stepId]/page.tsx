
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { useProjects } from "@/hooks/use-projects";
import type { Project, TutorialStep, SubTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { generateStepContent } from "@/ai/flows/generate-step-content";
import { ArrowLeft, Lightbulb, Loader2, CheckCircle, Circle, Bot, ArrowRight, CheckCircle2 } from "lucide-react";
import CodeBlock from "@/components/projects/CodeBlock";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export default function ProjectStepPage() {
  const params = useParams();
  const { id: projectId, stepId } = params;
  const { projects, updateProject, isLoading: projectsLoading } = useProjects();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [step, setStep] = useState<TutorialStep | null>(null);
  const [activeSubTask, setActiveSubTask] = useState<SubTask | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === projectId);
      setProject(foundProject || null);
      if (foundProject) {
        const foundStep = foundProject.steps.find(s => s.id === stepId);
        setStep(foundStep || null);
        if (foundStep && foundStep.subTasks.length > 0) {
            // Set the first subtask as active initially
            setActiveSubTask(foundStep.subTasks[0]);
        }
      }
    }
  }, [projectId, stepId, projects, projectsLoading]);

  const generateAndSetContent = useCallback(async (subTask: SubTask) => {
    if (!project || !step || subTask.content) {
      return;
    }

    setIsGeneratingContent(true);
    try {
      const fullOutline = project.steps.map(s => 
        `## ${s.title}\n${s.subTasks.map(st => `- ${st.title}: ${st.description}`).join('\n')}`
      ).join('\n\n');

      const result = await generateStepContent({
        projectTitle: project.title,
        stepTitle: step.title,
        subTaskTitle: subTask.title,
        subTaskDescription: subTask.description,
        fullOutline: fullOutline,
      });

      const updatedSubTask = { ...subTask, content: result.content };
      
      const updatedProject = {
          ...project,
          steps: project.steps.map(s => 
              s.id === step.id ? {
                  ...s,
                  subTasks: s.subTasks.map(st => st.id === subTask.id ? updatedSubTask : st)
              } : s
          )
      };

      updateProject(updatedProject);
      setActiveSubTask(updatedSubTask);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Generating Content",
        description: "Could not generate content for this step. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGeneratingContent(false);
    }
  }, [project, step, updateProject, toast]);


  useEffect(() => {
    if (activeSubTask && !activeSubTask.content) {
      generateAndSetContent(activeSubTask);
    }
  }, [activeSubTask, generateAndSetContent]);


  const handleSubTaskToggle = (subTaskId: string) => {
    if (!project || !step) return;

    const updatedSteps = project.steps.map(s => {
      if (s.id === step.id) {
        const updatedSubTasks = s.subTasks.map(subTask =>
          subTask.id === subTaskId
            ? { ...subTask, completed: !subTask.completed }
            : subTask
        );
        const allSubTasksCompleted = updatedSubTasks.every(st => st.completed);
        return { ...s, subTasks: updatedSubTasks, completed: allSubTasksCompleted };
      }
      return s;
    });

    const updatedProject = { ...project, steps: updatedSteps };
    updateProject(updatedProject);
  };
  
  const handleSubTaskSelect = (subTask: SubTask) => {
    setActiveSubTask(subTask);
  };

  if (projectsLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!project || !step) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Step not found</h2>
            <p className="text-muted-foreground mt-2">The tutorial step you are looking for does not exist.</p>
            <Button asChild className="mt-4">
                <Link href={`/projects/${projectId}`}>Back to Outline</Link>
            </Button>
        </div>
    );
  }
  
  const stepIndex = project.steps.findIndex(s => s.id === step.id);
  const prevStep = stepIndex > 0 ? project.steps[stepIndex - 1] : null;
  const nextStep = stepIndex < project.steps.length - 1 ? project.steps[stepIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
       <div className="mb-6">
        <Button variant="ghost" asChild>
            <Link href={`/projects/${project.id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Project Outline</Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{step.title}</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-4xl">{step.description}</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <main className="lg:col-span-2">
            <Card className="bg-card/50">
                <CardContent className="p-8">
                    {isGeneratingContent && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <p>Generating content...</p>
                        </div>
                    )}
                    {activeSubTask?.content && (
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw, [rehypePrism, { showLineNumbers: true }]]}
                                components={{ pre: ({node, ...props}) => <CodeBlock {...props} /> }}
                            >
                                {activeSubTask.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </CardContent>
            </Card>
          </main>
          <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                  <ChecklistCard 
                    step={step} 
                    activeSubTaskId={activeSubTask?.id}
                    onSubTaskToggle={handleSubTaskToggle}
                    onSubTaskSelect={handleSubTaskSelect}
                   />
              </div>
          </aside>
      </div>

      <footer className="mt-12 border-t pt-6 flex justify-between items-center">
            <div>
                {prevStep && (
                    <Button asChild variant="outline">
                        <Link href={`/projects/${project.id}/${prevStep.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous Step
                        </Link>
                    </Button>
                )}
            </div>
            <div>
                {nextStep && (
                     <Button asChild>
                        <Link href={`/projects/${project.id}/${nextStep.id}`}>
                            Next Step
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                 {!nextStep && project.steps.every(s => s.completed) && (
                     <Button asChild variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                        <Link href={`/`}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Project Complete!
                        </Link>
                    </Button>
                )}
            </div>
        </footer>
    </div>
  );
}

function ChecklistCard({ 
    step,
    activeSubTaskId,
    onSubTaskToggle,
    onSubTaskSelect
}: { 
    step: TutorialStep, 
    activeSubTaskId?: string | null,
    onSubTaskToggle: (subTaskId: string) => void,
    onSubTaskSelect: (subTask: SubTask) => void 
}) {
    const stepProgress = useMemo(() => {
        if (step.subTasks.length === 0) return step.completed ? 100 : 0;
        const completedCount = step.subTasks.filter(st => st.completed).length;
        return (completedCount / step.subTasks.length) * 100;
    }, [step]);
  
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Checklist</CardTitle>
                <CardDescription>Mark tasks as complete as you finish them.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2 mb-4">
                    <Progress value={stepProgress} className="h-2" />
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{step.subTasks.filter(t => t.completed).length} of {step.subTasks.length} tasks completed</span>
                        <span>{Math.round(stepProgress)}%</span>
                    </div>
                </div>
                <div className="space-y-1">
                    {step.subTasks.map(subTask => (
                        <div 
                          key={subTask.id} 
                          onClick={() => onSubTaskSelect(subTask)}
                          className={cn(
                            "flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors",
                             activeSubTaskId === subTask.id ? "bg-secondary" : "hover:bg-secondary/50"
                          )}
                        >
                            <div className="mt-1 flex items-center h-full">
                              <Checkbox
                                  id={`cb-${subTask.id}`}
                                  checked={subTask.completed}
                                  onCheckedChange={(e) => {
                                      e.stopPropagation();
                                      onSubTaskToggle(subTask.id);
                                  }}
                                  aria-label={`Mark sub-task ${subTask.title} as complete`}
                              />
                            </div>
                            <div className="grid gap-0.5 leading-none flex-1">
                                <label htmlFor={`cb-${subTask.id}`} className={`font-medium ${subTask.completed ? 'line-through text-muted-foreground' : ''} cursor-pointer`}>
                                    {subTask.title}
                                </label>
                                <p className="text-sm text-muted-foreground">{subTask.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
