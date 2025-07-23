
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Linkedin, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';


export const metadata: Metadata = {
    title: 'Contact Us - Project Code',
    description: 'Get in touch with the Project Code team. We\'d love to hear from you!',
};

export default function ContactPage() {
  return (
    
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <Separator className="my-4" />
      <h1 className="text-4xl font-bold mb-4 font-headline">Help Center</h1>
      <p>If you need assistance, please fill out the contact form below or email us. (Add your contact form or details here.)</p>
    </main>
  );
}
