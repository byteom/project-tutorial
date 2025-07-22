
"use client";

import { useEffect, useRef } from "react";
import type mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

interface ProjectSimulationProps {
  diagram: string;
}

export function ProjectSimulation({ diagram }: ProjectSimulationProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMermaid = async () => {
        const mermaid: (typeof import("mermaid"))["default"] = (await import("mermaid")).default;
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

        if (mermaidRef.current && diagram) {
            try {
                const { svg } = await mermaid.render("mermaid-graph", diagram);
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = svg;
                }
            } catch (e) {
                console.error("Mermaid rendering error:", e);
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = `<p class="text-destructive-foreground">Error rendering diagram.</p>`;
                }
            }
        }
    };
    initMermaid();
  }, [diagram]);

  if (!diagram) {
    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <BrainCircuit />
                    Project Simulation
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No simulation diagram available for this project.</p>
            </CardContent>
        </Card>
    );
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
            <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading Diagram...</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
