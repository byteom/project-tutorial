"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useProjects } from "@/hooks/use-projects";
import type { Project, TutorialStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

  const handleStepToggle = (stepId: string) => {
    if (!project) return;
    const updatedSteps = project.steps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    const updatedProject = { ...project, steps: updatedSteps };
    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const progressValue = useMemo(() => {
    if (!project || project.steps.length === 0) return 0;
    const completedSteps = project.steps.filter((step) => step.completed).length;
    return (completedSteps / project.steps.length) * 100;
  }, [project]);
  
  const [activeStep, setActiveStep] = useState<string | undefined>(
    project?.steps.find(s => !s.completed)?.id
  );

  useEffect(() => {
      if(project) {
        const firstIncomplete = project.steps.find(s => !s.completed);
        setActiveStep(firstIncomplete ? `item-${firstIncomplete.id}` : undefined);
      }
  }, [project])

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
        </Button>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">{project.title}</CardTitle>
          <CardDescription className="text-lg">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Progress</p>
            <Progress value={progressValue} className="w-full" />
            <p className="text-sm text-muted-foreground text-right">{Math.round(progressValue)}% Complete</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="font-headline text-3xl mb-4">Tutorial Steps</h2>
            <Accordion 
                type="single" 
                collapsible 
                className="w-full" 
                value={activeStep}
                onValueChange={setActiveStep}
            >
                {project.steps.map((step) => (
                <AccordionItem value={`item-${step.id}`} key={step.id}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 flex-1 mr-4">
                            <Checkbox
                                id={`cb-${step.id}`}
                                checked={step.completed}
                                onClick={(e) => { e.stopPropagation() }}
                                onCheckedChange={() => handleStepToggle(step.id)}
                                aria-label={`Mark step ${step.title} as complete`}
                            />
                            <label htmlFor={`cb-${step.id}`} className={`text-left ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {step.title}
                            </label>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose dark:prose-invert max-w-none px-4 text-base">
                        <ReactMarkdown>{step.content}</ReactMarkdown>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
        </div>
        <div className="lg:col-span-1">
            <PersonalizedAssistance currentStep={project.steps.find(s => `item-${s.id}` === activeStep) || project.steps.find(s => !s.completed)} />
        </div>
      </div>
    </div>
  );
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
            toast({ variant: "destructive", title: "No active step selected" });
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                    <Lightbulb className="mr-2 h-4 w-4"/>
                    Stuck? Get Personalized Assistance
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline">Personalized Assistance</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">
                    Struggling with {'"'}<strong>{currentStep?.title || "a step"}</strong>{'"'}? Describe your problem below.
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="userProgress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>What seems to be the problem?</FormLabel>
                                <FormControl><Textarea placeholder="e.g., I'm getting an error when I try to..." {...field} /></FormControl>
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
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>AI Assistant</AlertTitle>
                        <AlertDescription>{assistance}</AlertDescription>
                    </Aler
                )}
            </DialogContent>
        </Dialog>
    );
}
