
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeadline = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: {
    default: "PROJECTAI - Learn by Building Real-World Projects",
    template: `%s | PROJECTAI`,
  },
  description: "Stop watching tutorials and start building. PROJECTAI offers AI-guided, step-by-step learning paths for building real-world applications.",
  keywords: ["learn to code", "project-based learning", "ai coding assistant", "nextjs projects", "react projects"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "font-body antialiased",
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="container flex h-14 items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Cpu className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline sm:inline-block">
                  PROJECTAI
                </span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                  href="/project-practice"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Contact Us
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="p-4 text-center text-xs text-muted-foreground border-t">
              AI-Generated Content. Please review this guidance carefully. AI can make mistakes, so always verify critical information and use your judgment.
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
