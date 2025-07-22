import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="aspect-video overflow-hidden rounded-md mb-4 -mt-2 -mx-2">
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={project.dataAiHint || "project code"}
            />
          </div>
          <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="link" className="p-0 h-auto">
                Start Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
            </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
