
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Linkedin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
    title: 'Contact Us - PROJECTAI',
    description: 'Get in touch with the PROJECTAI team. We\'d love to hear from you!',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold font-headline tracking-tighter">Get in Touch</h1>
                <p className="text-muted-foreground mt-4 text-lg">
                    Have questions, feedback, or just want to connect? Here’s how you can reach out.
                </p>
            </header>
            
            <Card className="max-w-2xl mx-auto bg-card/80 border-border/50">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                        <AvatarImage src="https://github.com/byteom.png" alt="Om Singh" />
                        <AvatarFallback>OS</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 font-headline text-3xl">This project was built by Om Singh</CardTitle>
                    <CardDescription className="text-lg">
                       Feel free to reach out for collaborations or just to chat about tech.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center gap-4">
                     <Button asChild variant="outline">
                        <Link href="https://github.com/byteom" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2" />
                            GitHub
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="https://www.linkedin.com/in/om-singh-5144b2295/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2" />
                            LinkedIn
                        </Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="https://omsingh.vercel.app" target="_blank" rel="noopener noreferrer">
                            <User className="mr-2" />
                            Portfolio
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
