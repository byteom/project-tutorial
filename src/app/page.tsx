"use client";

import { ProjectList } from "@/components/projects/ProjectList";
import { GenerateTutorialForm } from "@/components/projects/GenerateTutorialForm";
import { useProjects } from "@/hooks/use-projects";

export default function Home() {
  const { projects, addProject, isLoading } = useProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center my-12">
        <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4 tracking-tighter">
          Welcome to ProjectForgeAI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Build fully-fledged projects from scratch with AI-powered guides.
          Generate a new tutorial or start with one of our existing projects.
        </p>
      </section>

      <section className="my-16">
        <GenerateTutorialForm addProject={addProject} />
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">
          Available Projects
        </h2>
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <div className="h-[225px] w-full rounded-xl bg-muted animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-[250px] bg-muted animate-pulse rounded-md" />
                        <div className="h-4 w-[200px] bg-muted animate-pulse rounded-md" />
                    </div>
                </div>
             ))}
           </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </section>
    </div>
  );
}
