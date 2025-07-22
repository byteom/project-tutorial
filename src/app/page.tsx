
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1 px-4">
      <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
        Learn by Building
      </h1>
      <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
        Stop watching tutorials. Start building real-world projects with our AI-guided, step-by-step learning paths.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/project-practice">
            Start Your First Project <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
