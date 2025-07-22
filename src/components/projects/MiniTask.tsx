
"use client";

import ReactMarkdown from "react-markdown";
import { Wand2 } from "lucide-react";

interface MiniTaskProps {
    message: string;
}

export default function MiniTask({ message }: MiniTaskProps) {
    return (
        <div className="prose dark:prose-invert max-w-none rounded-lg border border-primary/20 bg-primary/10 p-4 relative mt-6">
            <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground rounded-full p-2.5 border-4 border-background shadow-lg">
                <Wand2 className="h-5 w-5" />
            </div>
            <ReactMarkdown
                 components={{
                    h3: ({node, ...props}) => <h3 className="text-primary font-headline" {...props} />,
                 }}
            >
                {message}
            </ReactMarkdown>
        </div>
    );
}
