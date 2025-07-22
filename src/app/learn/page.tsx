
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTokenUsage } from "@/hooks/use-token-usage";
import { generateLearningPath, type GenerateLearningPathOutput } from "@/ai/flows/generate-learning-path";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import CodeBlock from "@/components/projects/CodeBlock";
import type { LearningPath } from "@/lib/types";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  difficulty: z.string({
    required_error: "Please select a difficulty level.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LearnAnythingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const { toast } = useToast();
  const { addTokens } = useTokenUsage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setLearningPath(null);
    try {
      const result = await generateLearningPath({
        topic: data.topic,
        difficulty: data.difficulty,
      });

      if (result.tokensUsed) {
        addTokens(result.tokensUsed);
      }
      
      setLearningPath(result);
      toast({
        title: "Learning Path Generated!",
        description: `Your guide to learning "${result.title}" is ready.`,
      });
      form.reset();

    } catch (error) {
      console.error("Failed to generate learning path:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem generating the learning path. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Bot className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Learn Anything</CardTitle>
            <CardDescription className="text-lg">
                Tell us what you want to learn, and we'll generate a personalized, step-by-step curriculum for you.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'C++', 'Python for Data Science', 'Quantum Computing Basics'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a difficulty level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Curriculum...
                  </>
                ) : (
                  "Generate Learning Path"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center mt-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Building your learning path... this might take a moment.</p>
        </div>
      )}

      {learningPath && (
        <div className="mt-12 space-y-8">
            <header className="text-center">
                <h2 className="text-4xl font-bold font-headline">{learningPath.title}</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{learningPath.introduction}</p>
            </header>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {learningPath.modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`item-${index}`} className="border-b-0">
                        <Card className="bg-card/80">
                            <AccordionTrigger className="p-6 text-left hover:no-underline">
                                <div className="flex-1">
                                    <h3 className="font-headline text-2xl">{module.title}</h3>
                                    <p className="text-muted-foreground mt-1 pr-4">{module.description}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="border-t pt-4 space-y-6">
                                    {module.lessons.map(lesson => (
                                        <div key={lesson.id}>
                                            <h4 className="font-headline text-xl text-primary">{lesson.title}</h4>
                                            <div className="prose dark:prose-invert max-w-none mt-2">
                                                <ReactMarkdown
                                                    rehypePlugins={[rehypeRaw, [rehypePrism, { showLineNumbers: true }]]}
                                                    components={{ pre: ({node, ...props}) => <CodeBlock {...props} /> }}
                                                >
                                                    {lesson.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      )}
    </div>
  );
}
