import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const people = [
  {
    name: "Om Singh",
    github: "byteom",
    githubUrl: "https://github.com/byteom",
    avatar: "https://github.com/byteom.png",
    bio: "Om is a B.Tech CSE student with a deep passion for fullstack development, cloud computing, and DevOps. He loves building scalable web apps and exploring new tech. Always up for a challenge and open to collaborations!",
  },
  {
    name: "Vaishnavi Raj",
    github: "vaishnavirajj",
    githubUrl: "https://github.com/vaishnavirajj",
    avatar: "https://github.com/vaishnavirajj.png",
    bio: "Vaishnavi is a B.Tech CSE student who thrives on solving problems with code. She is passionate about fullstack engineering, cloud, and devops, and enjoys working on innovative projects. Always eager to learn and connect!",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 font-headline">About Us</h1>
      <p className="mb-8 text-lg">We are Om Singh and Vaishnavi Raj, B.Tech students from a Computer Science background, passionate about building impactful tech products. Our interests span fullstack development, cloud computing, and DevOps. If you love these areas or want to hire/collaborate, let's connect!</p>
      <div className="flex flex-col gap-8">
        {people.map((person) => (
          <div key={person.github} className="flex items-center gap-6 bg-card/60 border border-border/30 rounded-lg p-4 shadow-sm">
            <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-full border-2 border-primary" />
            <div>
              <h2 className="text-2xl font-bold font-headline mb-1">{person.name}</h2>
              <p className="mb-2 text-muted-foreground">{person.bio}</p>
              <Link href={person.githubUrl} target="_blank" className="text-primary underline">GitHub: {person.github}</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded font-semibold">Interested in working with us? <span className="underline">We’re open to hiring, freelance, and collaboration opportunities!</span></span>
      </div>
    </main>
  );
} 