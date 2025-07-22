import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 bg-card/80">
        <CardHeader className="flex-row gap-4 items-start pb-4">
           <div className="aspect-square h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
             <Image
              src={project.image}
              alt={project.title}
              width={200}
              height={200}
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 h-full w-full"
              data-ai-hint={project.dataAiHint || "project code"}
            />
          </div>
          <div className="flex-1">
             <CardTitle className="font-headline text-lg mb-2">{project.title}</CardTitle>
             <Badge variant="outline">FREE</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-3">{project.description}</CardDescription>
        </CardContent>
        <CardFooter>
            <Button variant="secondary" className="w-full">
                Start Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
            </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}