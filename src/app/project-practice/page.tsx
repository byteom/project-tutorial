
"use client";

import { useState, useMemo } from "react";
import { ProjectList } from "@/components/projects/ProjectList";
import { GenerateTutorialForm } from "@/components/projects/GenerateTutorialForm";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Gift,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PROJECTS_PER_PAGE = 9;

export default function Home() {
  const { projects, addProject, deleteProject, isLoading } = useProjects();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const tracks = [
    { name: "Web Development", icon: <Flame className="text-orange-500" /> },
    { name: "Full-Stack SpringBoot", icon: <div className="h-4 w-4 rounded-full bg-green-500" /> },
    { name: "Machine Learning", icon: <Sparkles className="text-purple-400" /> },
    { name: "React & Node.js", icon: <div className="h-4 w-4 rounded-full bg-blue-500" /> },
    { name: "C++", icon: <div className="h-4 w-4 rounded-full bg-cyan-500" /> },
    { name: "Python", icon: <div className="h-4 w-4 rounded-full bg-yellow-400" /> },
  ];

  const difficultyFilters = ["Easy", "Medium", "Hard"];

  const handleFilterToggle = (tag: string) => {
    setActiveFilters(prev => {
        const newFilters = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
        setCurrentPage(1); // Reset to first page when filters change
        return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
  };

  const filteredProjects = useMemo(() => {
    if (activeFilters.length === 0) {
      return projects;
    }
    return projects.filter(project =>
      activeFilters.every(filter => project.tags?.some(tag => tag.toLowerCase() === filter.toLowerCase()))
    );
  }, [projects, activeFilters]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );


  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
      
      <GenerateTutorialForm addProject={addProject} />

      <section>
        <h1 className="text-3xl font-bold font-headline mb-2 tracking-tight">
          PROJECTS
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Discover hands-on projects across various technologies, structured into steps and tasks to guide you from start to finish. Pick a project, challenge yourself, and build real world skills—one step at a time!
        </p>
      </section>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-white">Browse <Badge variant="secondary" className="ml-1">{filteredProjects.length}</Badge></span>
          <span>Started Projects</span>
        </div>
      </div>
      
      <div className="space-y-4">
         <Card className="bg-card/80">
          <CardContent className="p-3 flex flex-wrap items-center gap-2 text-sm">
             <span className="text-muted-foreground mr-2">Track:</span>
             <Button variant={activeFilters.length === 0 ? 'secondary' : 'ghost'} size="sm" onClick={clearFilters}>All</Button>
             {tracks.map(track => {
                const tag = track.name === 'React & Node.js' ? 'React' : track.name;
                return (
                    <Button 
                        key={track.name} 
                        variant={activeFilters.includes(tag) ? 'secondary' : 'ghost'} 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleFilterToggle(tag)}
                    >
                        {track.icon}
                        {track.name}
                    </Button>
                )
             })}
           </CardContent>
         </Card>
         <Card className="bg-card/80">
            <CardContent className="p-3 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Filters:</span>
              <Button asChild variant="secondary" size="sm" className="gap-2">
                <Link href="#">
                  <Gift className="text-pink-400"/>
                  FREE
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                {difficultyFilters.map(level => (
                    <Button 
                        key={level} 
                        variant={activeFilters.includes(level) ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => handleFilterToggle(level)}
                    >
                        {level}
                    </Button>
                ))}
              </div>
              {activeFilters.length > 0 && 
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
              }
            </CardContent>
         </Card>
      </div>


      <section>
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <div className="h-[150px] w-full rounded-xl bg-muted animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-[250px] bg-muted animate-pulse rounded-md" />
                        <div className="h-4 w-[200px] bg-muted animate-pulse rounded-md" />
                    </div>
                </div>
             ))}
           </div>
        ) : (
          <ProjectList projects={paginatedProjects} deleteProject={deleteProject} />
        )}
      </section>

       {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
            <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
            </Button>
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
}
