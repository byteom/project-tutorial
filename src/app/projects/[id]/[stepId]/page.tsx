
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { generateStepContent } from "@/ai/flows/generate-step-content";
import { getPersonalizedAssistance, PersonalizedAssistanceOutput } from "@/ai/flows/personalized-assistance";
import { ArrowLeft, Lightbulb, Loader2, CheckCircle, Circle, Bot, ArrowRight, CheckCircle2 } from "lucide-react";
import CodeBlock from "@/components/projects/CodeBlock";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTokenUsage } from "@/hooks/use-token-usage";


export default function ProjectStepPage() {
  const params = useParams();
  const router = useRouter();
  const { id: projectId, stepId } = params;
  const { projects, updateProject, isLoading: projectsLoading } = useProjects();
  const { toast } = useToast();
  const { addTokens } = useTokenUsage();

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
            // Find first uncompleted task, or default to the first task
            const firstUncompleted = foundStep.subTasks.find(st => !st.completed);
            const initialSubTask = firstUncompleted || foundStep.subTasks[0];
            
            // Only set the active subtask if it's not already set to avoid re-renders
            if (!activeSubTask || (activeSubTask && activeSubTask.id !== initialSubTask.id)) {
                setActiveSubTask(initialSubTask);
            }
        }
      }
    }
  }, [projectId, stepId, projects, projectsLoading, activeSubTask]);

  const generateAndSetContent = useCallback(async (subTask: SubTask) => {
    // Critical check to prevent re-generation
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

      if (result.tokensUsed) {
        addTokens(result.tokensUsed);
      }

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

      // This call saves the new content to local storage via the useProjects hook
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
  }, [project, step, updateProject, toast, addTokens]);


  useEffect(() => {
    if (activeSubTask && !activeSubTask.content && !isGeneratingContent) {
      generateAndSetContent(activeSubTask);
    }
  }, [activeSubTask, generateAndSetContent, isGeneratingContent]);


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

  const handleNextStep = () => {
    if (project && nextStep) {
      const nextStepData = project.steps.find(s => s.id === nextStep.id);
      if (nextStepData) {
        const firstIncomplete = nextStepData.subTasks.find(st => !st.completed);
        setActiveSubTask(firstIncomplete || nextStepData.subTasks[0]);
        router.push(`/projects/${project.id}/${nextStep.id}`);
      }
    }
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
                <Link href={`/projects/${project.id}`}>Back to Outline</Link>
            </Button>
        </div>
    );
  }
  
  const stepIndex = project.steps.findIndex(s => s.id === step.id);
  const prevStep = stepIndex > 0 ? project.steps[stepIndex - 1] : null;
  const nextStep = stepIndex < project.steps.length - 1 ? project.steps[stepIndex + 1] : null;
  const activeTaskContext = `Sub-Task: ${activeSubTask?.title}\nDescription: ${activeSubTask?.description}\n\n${activeSubTask?.content}`;

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
            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="ai-assistant">Ask AI</TabsTrigger>
              </TabsList>
              <TabsContent value="instructions">
                <Card className="bg-card/50 mt-4">
                    <CardContent className="p-8">
                        {(isGeneratingContent && !activeSubTask?.content) && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <p>Generating content for {activeSubTask?.title}...</p>
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
              </TabsContent>
              <TabsContent value="ai-assistant">
                 <Card className="bg-card/50 mt-4">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                           <Bot /> AI Assistant
                        </CardTitle>
                        <CardDescription>
                            Stuck on this task? Ask a question and the AI will try to help you based on the task's content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <PersonalizedAssistance context={activeTaskContext} />
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                     <Button onClick={handleNextStep}>
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
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
                                  onCheckedChange={() => onSubTaskToggle(subTask.id)}
                                  onClick={(e) => {
                                      // Stop propagation to prevent the parent div's onClick from firing
                                      e.stopPropagation();
                                  }}
                                  aria-label={`Mark sub-task ${subTask.title} as complete`}
                              />
                            </div>
                            <div className="grid gap-0.5 leading-none flex-1">
                                <label htmlFor={`cb-${subTask.id}`} className={cn(
                                  "font-medium cursor-pointer",
                                  subTask.completed ? 'line-through text-muted-foreground' : ''
                                  )}>
                                    {subTask.title}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


const assistanceFormSchema = z.object({
  question: z.string().min(10, "Please ask a more detailed question."),
  userCode: z.string().optional(),
});

function PersonalizedAssistance({ context }: { context: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [assistance, setAssistance] = useState<PersonalizedAssistanceOutput | null>(null);
  const { toast } = useToast();
  const { addTokens } = useTokenUsage();

  const form = useForm<z.infer<typeof assistanceFormSchema>>({
    resolver: zodResolver(assistanceFormSchema),
    defaultValues: { question: "", userCode: "" },
  });

  const onSubmit = async (values: z.infer<typeof assistanceFormSchema>) => {
    setIsLoading(true);
    setAssistance(null);
    try {
      const result = await getPersonalizedAssistance({
        tutorialStep: context,
        userProgress: values.question,
        userCode: values.userCode,
      });
      if (result.tokensUsed) {
        addTokens(result.tokensUsed);
      }
      setAssistance(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error getting assistance",
        description: "The AI assistant could not be reached. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Question</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'I'm getting a 'module not found' error. What does that mean?'"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Code (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the relevant code snippet here."
                    rows={8}
                    {...field}
                    className="font-mono text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Help
          </Button>
        </form>
      </Form>
        
      {isLoading && !assistance && (
        <div className="flex items-center gap-3 text-muted-foreground rounded-lg border p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Thinking...</p>
        </div>
      )}

      {assistance?.assistanceMessage && (
        <div className="prose dark:prose-invert max-w-none rounded-lg border border-primary/20 bg-primary/5 p-4">
            <ReactMarkdown>
                {assistance.assistanceMessage}
            </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

    

    
