
import Link from "next/link";
import type { Project } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BookOpen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ProjectCardProps {
  project: Project;
  deleteProject: (id: string) => void;
}

export function ProjectCard({ project, deleteProject }: ProjectCardProps) {

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmation = confirm(`Are you sure you want to delete "${project.title}"?`);
    if (confirmation) {
      deleteProject(project.id);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 bg-card/80 group">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg mb-2">{project.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-50 hover:opacity-100 transition-opacity" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
         <Badge variant="outline">FREE</Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
      </CardContent>
      <CardFooter>
          <Button asChild variant="secondary" className="w-full">
              <Link href={`/projects/${project.id}`}>
                Start Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
