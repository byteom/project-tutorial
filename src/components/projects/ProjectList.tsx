
"use client";

import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  deleteProject: (id: string) => void;
}

export function ProjectList({ projects, deleteProject }: ProjectListProps) {
  if (projects.length === 0) {
    return (
        <div className="text-center text-muted-foreground">
            No projects found. Try generating one!
        </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} deleteProject={deleteProject} />
      ))}
    </div>
  );
}
