
"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Star } from "lucide-react";
import type { SubTask } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepOutlineCardProps {
  subTask: SubTask;
  projectId: string;
  stepId: string;
}

export function StepOutlineCard({ subTask, projectId, stepId }: StepOutlineCardProps) {
  const isCompleted = subTask.completed;
  const href = `/projects/${projectId}/${stepId}#${subTask.id}`;

  return (
    <Link href={href} className="group block">
        <div className={cn(
            "h-full rounded-lg border bg-card text-card-foreground p-4 transition-all duration-200 ease-in-out hover:border-primary/60 hover:shadow-md",
            isCompleted ? "border-green-500/50 bg-green-500/5" : ""
        )}>
            <div className="flex items-start gap-4">
                {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/50 flex-shrink-0 mt-1" />
                )}
                <div>
                    <h3 className="font-semibold">{subTask.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subTask.description}</p>
                </div>
            </div>
      </div>
    </Link>
  );
}
