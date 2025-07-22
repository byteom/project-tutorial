
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { interviewQuestions } from '@/lib/interview-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateInterviewFeedback, GenerateInterviewFeedbackOutput } from '@/ai/flows/generate-interview-feedback';
import { useToast } from '@/hooks/use-toast';
import { useTokenUsage } from '@/hooks/use-token-usage';
import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BellCurveChart } from '@/components/charts/BellCurveChart';
import { useAuth } from '@/hooks/use-auth';
import { addInterviewAnswer } from '@/lib/firestore-interview-answers';

const formSchema = z.object({
    answer: z.string().min(50, {
        message: 'Your answer should be at least 50 characters long to get effective feedback.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuestionPracticePage() {
    const params = useParams();
    const { user } = useAuth();
    const question = interviewQuestions.find(q => q.id === params.questionId);

    const [isGenerating, setIsGenerating] = useState(false);
    const [feedback, setFeedback] = useState<GenerateInterviewFeedbackOutput | null>(null);
    const [lastAnswer, setLastAnswer] = useState('');
    const { toast } = useToast();
    const { addTokens } = useTokenUsage();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answer: '',
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!question || !user) return;
        setIsGenerating(true);
        setFeedback(null);
        setLastAnswer(data.answer);
        try {
            const result = await generateInterviewFeedback({
                question: question.question,
                answer: data.answer,
            });

            if(result.tokensUsed) {
                addTokens(result.tokensUsed);
            }

            setFeedback(result);
            
            // Save the result to Firestore
            await addInterviewAnswer(user.uid, {
                id: `${user.uid}-${question.id}-${Date.now()}`,
                questionId: question.id,
                question: question.question,
                answer: data.answer,
                feedback: result,
                createdAt: Date.now(),
            });

            toast({
                title: 'Feedback Generated!',
                description: 'Your AI-powered feedback is ready and saved to your history.',
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
                    <p className="text-muted-foreground mt-4">Analyzing your answer... this might take a moment.</p>
                </div>
            )}

            {feedback && (
                <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">How you did:</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(feedback.analysis).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        <p className="text-red-400">{value.rating}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="font-headline text-2xl">How you compare:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BellCurveChart score={feedback.score} />
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                    <Wand2 />
                                    Feedback
                                </CardTitle>
                                <TooltipProvider>
                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm">Original question</Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p>{question.question}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                         <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm">Response</Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                 <p>{lastAnswer}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none">
                             <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
