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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getPersonalizedAssistance } from "@/ai/flows/personalized-assistance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
import CodeBlock from "@/components/projects/CodeBlock";
import { Separator } from "@/components/ui/separator";

const assistanceFormSchema = z.object({
  userProgress: z.string().min(10, "Please describe the problem in a bit more detail."),
});

type AssistanceFormValues = z.infer<typeof assistanceFormSchema>;

export default function ProjectPage() {
  const params = useParams();
  const { projects, updateProject, isLoading } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === params.id);
      setProject(foundProject || null);
    }
  }, [params.id, projects, isLoading]);

  const handleSubTaskToggle = (stepId: string, subTaskId: string) => {
    if (!project) return;

    const updatedSteps = project.steps.map((step) => {
      if (step.id === stepId) {
        const updatedSubTasks = step.subTasks.map((subTask) =>
          subTask.id === subTaskId
            ? { ...subTask, completed: !subTask.completed }
            : subTask
        );
        const allSubTasksCompleted = updatedSubTasks.every(st => st.completed);
        return { ...step, subTasks: updatedSubTasks, completed: allSubTasksCompleted };
      }
      return step;
    });

    const updatedProject = { ...project, steps: updatedSteps };
    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const totalProgress = useMemo(() => {
    if (!project || project.steps.length === 0) return 0;
    const totalSubTasks = project.steps.reduce((acc, step) => acc + step.subTasks.length, 0);
    if (totalSubTasks === 0) return 0;
    const completedSubTasks = project.steps.reduce((acc, step) => {
      return acc + step.subTasks.filter(st => st.completed).length;
    }, 0);
    return (completedSubTasks / totalSubTasks) * 100;
  }, [project]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!project) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
            <Button asChild className="mt-4">
                <Link href="/">Go back to projects</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
        </Button>
      </div>
      <header className="mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">{project.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{project.description}</p>
        <div className="mt-6 space-y-2">
            <Progress value={totalProgress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-right">{Math.round(totalProgress)}% Complete</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {project.steps.map((step, index) => (
            <TutorialStepSection 
              key={step.id} 
              step={step} 
              stepNumber={index + 1}
              onSubTaskToggle={handleSubTaskToggle}
            />
          ))}
        </div>
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <PersonalizedAssistance 
              currentStep={project.steps.find(s => !s.completed) || project.steps[project.steps.length - 1]} 
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function TutorialStepSection({ step, stepNumber, onSubTaskToggle }: { step: TutorialStep, stepNumber: number, onSubTaskToggle: (stepId: string, subTaskId: string) => void }) {
  const stepProgress = useMemo(() => {
    if (step.subTasks.length === 0) return step.completed ? 100 : 0;
    const completedCount = step.subTasks.filter(st => st.completed).length;
    return (completedCount / step.subTasks.length) * 100;
  }, [step]);
  
  return (
    <section>
        <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex-shrink-0">
                {stepNumber}
            </div>
            <div>
                <h2 className="font-headline text-3xl">{step.title}</h2>
                <p className="text-muted-foreground mt-1">{step.description}</p>
            </div>
        </div>

        <div className="mt-6 ml-6 pl-12 border-l-2 border-border">
            <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{step.subTasks.filter(t => t.completed).length} of {step.subTasks.length} tasks completed</span>
                    <span className="text-sm text-muted-foreground">{Math.round(stepProgress)}%</span>
                </div>
                <Progress value={stepProgress} className="h-2" />
            </div>

            <div className="space-y-4 mb-8">
                {step.subTasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                         <Checkbox
                            id={`cb-${step.id}-${subTask.id}`}
                            checked={subTask.completed}
                            onCheckedChange={() => onSubTaskToggle(step.id, subTask.id)}
                            aria-label={`Mark sub-task ${subTask.title} as complete`}
                        />
                         <label htmlFor={`cb-${step.id}-${subTask.id}`} className={`flex-1 text-sm ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {subTask.title}
                        </label>
                    </div>
                ))}
            </div>
            
            <Separator className="my-8" />
            
            <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw, [rehypePrism, { showLineNumbers: true }]]}
                    components={{ pre: ({node, ...props}) => <CodeBlock {...props} /> }}
                >
                    {step.content}
                </ReactMarkdown>
            </div>
        </div>
    </section>
  )
}

function PersonalizedAssistance({ currentStep }: { currentStep?: TutorialStep }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [assistance, setAssistance] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(true);

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
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="text-primary"/>
                    Personalized Assistance
                </CardTitle>
                <CardDescription>
                   Struggling with {'"'}<strong>{currentStep?.title || "a step"}</strong>{'"'}? Describe your problem below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="userProgress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>What seems to be the problem?</FormLabel>
                                <FormControl><Textarea placeholder="e.g., I'm getting an error when I try to..." {...field} rows={5} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Help
                        </Button>
                    </form>
                </Form>
                 {assistance && (
                    <Alert className="mt-4">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>AI Assistant</AlertTitle>
                        <AlertDescription>{assistance}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
