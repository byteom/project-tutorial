
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare } from "lucide-react";

export default function LearnAnythingPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-2xl text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center justify-center gap-3">
                    <BotMessageSquare className="w-8 h-8 text-primary" />
                    Learn Anything
                </CardTitle>
                <CardDescription className="text-lg">
                    This feature is coming soon.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Soon, you'll be able to ask the AI to teach you about any topic, and it will generate a personalized, step-by-step learning path for you, complete with projects and examples.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
