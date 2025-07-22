
'use client';

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return null; // or a loading spinner, but layout effect handles redirect
  }

  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
