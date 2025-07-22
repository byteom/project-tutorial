
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeadline = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "ProjectForgeAI",
  description: "AI-powered project-based learning platform",
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
        <SidebarProvider>
          <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-1">
              <AppSidebar />
              <main className="flex-1 flex flex-col">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
        <footer className="p-4 text-center text-xs text-muted-foreground border-t">
            AI-Generated Content. Please review this guidance carefully. AI can make mistakes, so always verify critical information and use your judgment.
        </footer>
      </body>
    </html>
  );
}
