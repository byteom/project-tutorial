
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { interviewQuestions } from '@/lib/interview-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Star } from 'lucide-react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateInterviewFeedback, GenerateInterviewFeedbackOutput } from '@/ai/flows/generate-interview-feedback';
import { useToast } from '@/hooks/use-toast';
import { useTokenUsage } from '@/hooks/use-token-usage';
import ReactMarkdown from 'react-markdown';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
    answer: z.string().min(50, {
        message: 'Your answer should be at least 50 characters long to get effective feedback.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuestionPracticePage() {
    const params = useParams();
    const question = interviewQuestions.find(q => q.id === params.questionId);

    const [isGenerating, setIsGenerating] = useState(false);
    const [feedback, setFeedback] = useState<GenerateInterviewFeedbackOutput | null>(null);
    const { toast } = useToast();
    const { addTokens } = useTokenUsage();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answer: '',
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!question) return;
        setIsGenerating(true);
        setFeedback(null);
        try {
            const result = await generateInterviewFeedback({
                question: question.question,
                answer: data.answer,
            });

            if(result.tokensUsed) {
                addTokens(result.tokensUsed);
            }

            setFeedback(result);
            toast({
                title: 'Feedback Generated!',
                description: 'Your AI-powered feedback is ready.',
            });
        } catch (error) {
            console.error('Failed to generate feedback', error);
            toast({
                variant: 'destructive',
                title: 'Error Generating Feedback',
                description: 'There was a problem. Please try again.',
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (!question) {
        return <div className="text-center p-8">Question not found.</div>;
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">{question.question}</CardTitle>
                    <CardDescription className="text-lg pt-2">
                        Practice your answer below. When you're ready, submit it for AI-powered feedback.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Answer</FormLabel>
                                        <FormControl>
                                            <Textarea rows={10} placeholder="Type your response here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Feedback...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Get Feedback
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isGenerating && (
                <div className="text-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground mt-4">Analyzing your answer...</p>
                </div>
            )}

            {feedback && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">AI Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Overall Score</h3>
                            <div className="flex items-center gap-4">
                                <Progress value={feedback.score} className="h-3" />
                                <span className="font-bold text-lg text-primary">{feedback.score}/100</span>
                            </div>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

