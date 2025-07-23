
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

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
    default: "Project Code - Learn by Building Real-World Projects",
    template: `%s | Project Code`,
  },
  description: "Stop watching tutorials and start building. Project Code offers AI-guided, step-by-step learning paths for building real-world applications.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
