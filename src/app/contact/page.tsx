
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the PROJECTAI team. We\'d love to hear from you!',
};

export default function ContactPage() {
    return (
        <div className="container py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Mail className="w-12 h-12 mx-auto text-primary" />
                    <CardTitle className="mt-4 font-headline text-3xl">Contact Us</CardTitle>
                    <CardDescription className="text-lg">
                        Have questions or feedback? Reach out to us.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        This is a project by Om Singh. You can find him on GitHub.
                    </p>
                    <a 
                        href="https://github.com/byteom" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-primary hover:underline"
                    >
                        @byteom on GitHub
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
