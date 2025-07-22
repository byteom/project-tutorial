
"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getPersonalizedAssistance } from "@/ai/flows/personalized-assistance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Lightbulb, Loader2, CheckCircle, Circle, Bot } from "lucide-react";
import CodeBlock from "@/components/projects/CodeBlock";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const assistanceFormSchema = z.object({
  userProgress: z.string().min(10, "Please describe the problem in a bit more detail."),
});

type AssistanceFormValues = z.infer<typeof assistanceFormSchema>;

export default function ProjectStepPage() {
  const params = useParams();
  const { id: projectId, stepId } = params;
  const { projects, updateProject, isLoading } = useProjects();

  const [project, setProject] = useState<Project | null>(null);
  const [step, setStep] = useState<TutorialStep | null>(null);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === projectId);
      setProject(foundProject || null);
      if (foundProject) {
        const foundStep = foundProject.steps.find(s => s.id === stepId);
        setStep(foundStep || null);
      }
    }
  }, [projectId, stepId, projects, isLoading]);

  const handleSubTaskToggle = (subTaskId: string) => {
    if (!project || !step) return;

    let updatedProject: Project | null = null;

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

    updatedProject = { ...project, steps: updatedSteps };
    
    setProject(updatedProject);
    updateProject(updatedProject);
  };
  
  if (isLoading) {
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
  const allSubTasksCompleted = step.subTasks.every(st => st.completed);

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
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-primary/80" />
                <span>Step {stepIndex + 1}</span>
            </div>
             <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary/80" />
                <span>Keywords: {step.subTasks.map(st => st.title.split(' ')[0]).slice(0, 3).join(', ')}</span>
            </div>
            {allSubTasksCompleted && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                </Badge>
            )}
        </div>
      </header>

      <Separator className="my-8 bg-border/50" />
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="help">
                Get Help 
                <Badge variant="default" className="ml-2 !text-[10px] px-1.5 py-0.5 h-auto">NEW</Badge>
            </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <main className="lg:col-span-2">
                   {allSubTasksCompleted && (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 text-green-400 mb-6">
                            <CheckCircle className="h-5 w-5" />
                            <p className="font-medium">You've completed this step!</p>
                        </div>
                    )}
                    <Card className="bg-card/50">
                        <CardContent className="p-8">
                            <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw, [rehypePrism, { showLineNumbers: true }]]}
                                    components={{ pre: ({node, ...props}) => <CodeBlock {...props} /> }}
                                >
                                    {step.content}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        <ChecklistCard step={step} onSubTaskToggle={handleSubTaskToggle} />
                    </div>
                </aside>
            </div>
        </TabsContent>
        <TabsContent value="help">
             <PersonalizedAssistance currentStep={step} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChecklistCard({ step, onSubTaskToggle }: { step: TutorialStep, onSubTaskToggle: (subTaskId: string) => void }) {
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
                <div className="space-y-4">
                    {step.subTasks.map(subTask => (
                        <div key={subTask.id} className="flex items-start gap-3">
                            <Checkbox
                                id={`cb-${subTask.id}`}
                                checked={subTask.completed}
                                onCheckedChange={() => onSubTaskToggle(subTask.id)}
                                aria-label={`Mark sub-task ${subTask.title} as complete`}
                                className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label htmlFor={`cb-${subTask.id}`} className={`font-medium ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
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

function PersonalizedAssistance({ currentStep }: { currentStep?: TutorialStep }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [assistance, setAssistance] = useState<string | null>(null);

    const form = useForm<AssistanceFormValues>({
        resolver: zodResolver(assistanceFormSchema),
        defaultValues: { userProgress: "" },
    });
    
    const onSubmit = async (data: AssistanceFormValues) => {
        if (!currentStep) {
            toast({ variant: "destructive", title: "No active step to get help for." });
            return;
        }

        setIsLoading(true);
        setAssistance(null);

        try {
            const result = await getPersonalizedAssistance({
                tutorialStep: currentStep.title,
                userProgress: data.userProgress,
            });
            setAssistance(result.assistanceMessage);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error getting assistance",
                description: "Could not connect to the AI assistant. Please try again.",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bot className="text-primary"/>
                    AI Assistant
                </CardTitle>
                <CardDescription>
                   Struggling with this step? Describe your problem or question below to get targeted help from our AI assistant.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="userProgress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>What seems to be the problem?</FormLabel>
                                <FormControl><Textarea placeholder="e.g., I'm getting an error when I try to run the server. Here's the error message..." {...field} rows={5} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Help
                        </Button>
                    </form>
                </Form>
                 {assistance && (
                    <Alert className="mt-6">
                        <Bot className="h-4 w-4" />
                        <AlertTitle>AI Assistant's Response</AlertTitle>
                        <AlertDescription>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{assistance}</ReactMarkdown>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
