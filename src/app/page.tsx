"use client";

import { ProjectList } from "@/components/projects/ProjectList";
import { GenerateTutorialForm } from "@/components/projects/GenerateTutorialForm";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronDown,
  Gift,
  Plus,
  Sparkles,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { projects, addProject, isLoading } = useProjects();

  const tracks = [
    { name: "Web Development", icon: <Flame className="text-orange-500" /> },
    { name: "Full-Stack SpringBoot", icon: <div className="h-4 w-4 rounded-full bg-green-500" /> },
    { name: "Machine Learning", icon: <Sparkles className="text-purple-400" /> },
    { name: "React & Node.js", icon: <div className="h-4 w-4 rounded-full bg-blue-500" /> },
    { name: "C++", icon: <div className="h-4 w-4 rounded-full bg-cyan-500" /> },
    { name: "Python", icon: <div className="h-4 w-4 rounded-full bg-yellow-400" /> },
  ]

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 space-y-4">
      {/* Top Banners */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white">
        <CardContent className="p-3">
          <div className="flex items-center justify-center gap-2">
             <Flame className="text-orange-300"/>
            <span>EXTENDED! Our 60% Discount Now Ends Today — 22nd July. This is your last chance — Don't Miss Out!</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/80">
        <CardContent className="p-3 flex items-center justify-between">
           <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400"/>
            <p>New! Checkout new projects in Next.js with much elaborate tasks, let us know if they are better than the old ones!</p>
          </div>
          <Button variant="secondary" size="sm">Checkout</Button>
        </CardContent>
      </Card>
      <Card className="bg-card/80">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="text-pink-400"/>
            <p>We add 10+ new projects weekly! Can't find what you need? Generate your own projects now!</p>
          </div>
          <Button size="sm">Try for free!</Button>
        </CardContent>
      </Card>


      <section className="pt-8">
        <h1 className="text-3xl font-bold font-headline mb-2 tracking-tight">
          PROJECTS
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Discover hands-on projects across various technologies, structured into steps and tasks to guide you from start to finish. Pick a project, challenge yourself, and build real world skills—one step at a time!
        </p>
      </section>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-white">Browse <Badge variant="secondary" className="ml-1">133</Badge></span>
          <span>Started Projects</span>
        </div>
      </div>
      
      <div className="space-y-4">
         <Card className="bg-card/80">
          <CardContent className="p-3 flex flex-wrap items-center gap-2 text-sm">
             <span className="text-muted-foreground mr-2">Track:</span>
             <Button variant="secondary" size="sm">All</Button>
             {tracks.map(track => (
                <Button key={track.name} variant="ghost" size="sm" className="gap-2">
                  {track.icon}
                  {track.name}
                </Button>
             ))}
             <Button variant="ghost" size="sm">+6 More</Button>
           </CardContent>
         </Card>
         <Card className="bg-card/80">
            <CardContent className="p-3 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Filters:</span>
              <Button variant="secondary" size="sm" className="gap-2">
                <Gift className="text-pink-400"/>
                FREE
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                Level
                <ChevronDown className="h-4 w-4"/>
              </Button>
              <Button variant="ghost" size="sm">Clear</Button>
            </CardContent>
         </Card>
      </div>


      <section>
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