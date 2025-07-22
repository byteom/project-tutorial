
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserInterviewAnswers } from '@/lib/firestore-interview-answers';
import type { InterviewAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquareQuote, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AnsweredQuestionsPage() {
    const { user } = useAuth();
    const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getUserInterviewAnswers(user.uid)
                .then(data => {
                    setAnswers(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch answers:", err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold font-headline tracking-tighter">Your Practice History</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Review your past answers and the feedback you've received.
                </p>
            </header>

            {answers.length > 0 ? (
                <div className="space-y-6">
                    {answers.map(answer => (
                        <Card key={answer.id}>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{answer.question}</CardTitle>
                                <CardDescription>
                                    Practiced on: {new Date(answer.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Your Answer</AccordionTrigger>
                                        <AccordionContent className="prose dark:prose-invert max-w-none">
                                            <p>{answer.answer}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>AI Feedback</AccordionTrigger>
                                        <AccordionContent className="prose dark:prose-invert max-w-none">
                                            <ReactMarkdown>{answer.feedback.feedback}</ReactMarkdown>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No History Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You haven't practiced any questions yet. Go back and give one a try!
                    </p>
                </div>
            )}
        </div>
    );
}
