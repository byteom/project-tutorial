
'use client';

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // A simple check for admin role. In a real app, this should be a secure check against a backend.
  const isAdmin = user && user.email === 'admin@example.com'; 

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    } else if (!loading && !isAdmin) {
        // If user is not admin, redirect them away.
        router.replace("/project-practice");
    }
  }, [user, loading, router, isAdmin]);

  if (loading || !isAdmin) {
    return <div className="flex justify-center items-center h-screen">Loading or checking permissions...</div>;
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
