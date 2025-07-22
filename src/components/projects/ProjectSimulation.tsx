
"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  themeVariables: {
    background: '#111827', // A dark background
    primaryColor: '#3b82f6', // A nice blue for nodes
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#3b82f6',
    lineColor: '#6b7280',
    textColor: '#d1d5db',
    fontSize: '14px'
  }
});

interface ProjectSimulationProps {
  diagram: string;
}

export function ProjectSimulation({ diagram }: ProjectSimulationProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current && diagram) {
      mermaid.render("mermaid-graph", diagram, (svgCode) => {
        if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svgCode;
        }
      });
    }
  }, [diagram]);

  if (!diagram) {
    return null;
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <BrainCircuit />
            Project Simulation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mermaidRef} className="mermaid-container w-full flex justify-center">
          {diagram}
        </div>
      </CardContent>
    </Card>
  );
}
