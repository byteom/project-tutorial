
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { StepOutlineCard } from "@/components/projects/StepOutlineCard";
import { Badge } from "@/components/ui/badge";

export default function ProjectOutlinePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { projects, updateProject, isLoading } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === params.id);
      setProject(foundProject || null);
    }
  }, [params.id, projects, isLoading]);
  
  const totalProgress = useMemo(() => {
    if (!project || project.steps.length === 0) return 0;
    const totalSubTasks = project.steps.reduce((acc, step) => acc + step.subTasks.length, 0);
    if (totalSubTasks === 0) return 0;
    const completedSubTasks = project.steps.reduce((acc, step) => {
      return acc + step.subTasks.filter(st => st.completed).length;
    }, 0);
    return (completedSubTasks / totalSubTasks) * 100;
  }, [project]);

  useEffect(() => {
    console.log("[DEBUG] authLoading:", authLoading, "user:", user);
    console.log("[DEBUG] isLoading:", isLoading, "projects:", projects.map(p => p.id));
    console.log("[DEBUG] params.id:", params.id);
    if (project) {
      console.log("[DEBUG] Found project:", project);
    } else {
      console.log("[DEBUG] Project not found in loaded projects.");
    }
  }, [authLoading, user, isLoading, projects, params.id, project]);

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.replace("/auth");
    }
    return null;
  }

  if (!projects.length) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!project) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
            <Button asChild className="mt-4">
                <Link href="/project-practice">Go back to projects</Link>
            </Button>
        </div>
    );
  }

  const { id: projectId, steps } = project;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
            <Link href="/project-practice"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Projects</Link>
        </Button>
      </div>
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">{project.title}</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">{project.description}</p>
        <div className="mt-6 max-w-md mx-auto">
            <Progress value={totalProgress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-right mt-2">{Math.round(totalProgress)}% Complete</p>
        </div>
      </header>

      <div className="space-y-16">
        {steps.map((step, index) => {
            const totalSubTasks = step.subTasks.length;
            const completedSubTasks = step.subTasks.filter(s => s.completed).length;
            const stepProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;
            const isCurrent = (index === 0 && completedSubTasks < totalSubTasks) || (index > 0 && steps[index-1].completed && !step.completed);

            return (
                <section key={step.id} className="p-8 rounded-xl border bg-card/50">
                    <div className="flex items-start gap-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex-shrink-0">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                               <h2 className="font-headline text-3xl">{step.title}</h2>
                               {isCurrent && <Badge variant="secondary">Current</Badge>}
                            </div>
                            <p className="text-muted-foreground mt-1">{step.description}</p>
                            <div className="mt-4 space-y-2">
                                <Progress value={stepProgress} className="h-2" />
                                <p className="text-sm text-muted-foreground">{completedSubTasks} of {totalSubTasks} tasks completed</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.subTasks.map(subTask => (
                            <StepOutlineCard 
                                key={subTask.id}
                                subTask={subTask}
                                projectId={projectId}
                                stepId={step.id}
                                updateProject={updateProject}
                            />
                        ))}
                    </div>
                </section>
            );
        })}
      </div>
    </div>
  );
}
