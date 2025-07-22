
'use client'

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, CheckCircle, FileQuestion, MessageSquareHeart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { interviewQuestions } from "@/lib/interview-data";

const categories = [
    {
        title: "Answered Questions",
        description: "View all of your feedback and answered questions.",
        icon: <CheckCircle className="h-6 w-6" />,
        color: "bg-gray-800 border-gray-700",
        buttonText: "View your questions",
    },
    {
        title: "Recommended",
        description: "Our top questions to help you get hired.",
        icon: <BadgeCheck className="h-6 w-6" />,
        color: "bg-purple-800/20 border-purple-600/50",
        buttonText: "View recommended",
    },
    {
        title: "Community Favorites",
        description: "Our top questions voted on by our users.",
        icon: <MessageSquareHeart className="h-6 w-6" />,
        color: "bg-green-800/20 border-green-600/50",
        buttonText: "View favorites",
    },
    {
        title: "Essentials",
        description: "A list of must-practice questions before your interview.",
        icon: <FileQuestion className="h-6 w-6" />,
        color: "bg-blue-800/20 border-blue-600/50",
        buttonText: "View our essentials",
    },
];

export default function InterviewPracticePage() {
    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 space-y-12">
            <header className="text-center">
                <h1 className="text-5xl font-bold font-headline tracking-tighter">
                    Be 5x more prepared for your next interview
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Explore our extensive question library. Get immediate, AI-powered feedback to refine your answers and enhance your interview readiness.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                    <Card key={i} className={`flex flex-col ${cat.color} text-white`}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                {cat.icon}
                                <CardTitle className="font-headline text-2xl">{cat.title}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-300 pt-2">{cat.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <button className="w-full text-center bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                                {cat.buttonText}
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                {interviewQuestions.map(q => (
                    <Card key={q.id} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{q.question}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{q.category}</Badge>
                                    <Badge variant="secondary">{q.type}</Badge>
                                </div>
                            </div>
                            <Link href={`/interview-practice/${q.id}`}>
                                <Button>
                                    Practice <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}
