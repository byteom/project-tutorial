"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === "undefined" || !children) return;
    
    const codeElement = children as React.ReactElement;
    const codeString = codeElement.props.children as string;

    navigator.clipboard.writeText(codeString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <pre className={cn(className, "py-4 pr-4 pl-12")} {...props}>
        {children}
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 text-white"
        onClick={handleCopy}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </div>
  );
}
