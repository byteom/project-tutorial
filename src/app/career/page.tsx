import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CareerPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 font-headline">Careers at Project Code</h1>
      <p className="mb-6 text-lg">We're always looking for passionate, creative, and driven people to join our journey! Whether you're a developer, designer, educator, or tech enthusiast, we want to hear from you.</p>
      <div className="mb-8 bg-card/60 border border-border/30 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Current Openings</h2>
        <ul className="list-disc ml-6">
          <li><strong>Fullstack Developer (Intern/Freelance):</strong> Work on exciting new features, collaborate on product design, and help us scale our platform.</li>
          <li><strong>Content Creator (Tech/Education):</strong> Help us build engaging tutorials, guides, and learning paths for our users.</li>
          <li><strong>Cloud & DevOps Enthusiast:</strong> Optimize our infrastructure and help us deliver a seamless experience to learners worldwide.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc ml-6">
          <li>Work with a passionate, friendly team of builders and learners.</li>
          <li>Remote-friendly and flexible work culture.</li>
          <li>Opportunities to learn, grow, and make a real impact.</li>
        </ul>
      </div>
      <div className="text-center mt-10">
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded font-semibold">Interested? <Link href="/contact" className="underline">Contact us</Link> with your resume, portfolio, or just a message about why you want to join!</span>
      </div>
    </main>
  );
} 