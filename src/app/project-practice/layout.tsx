
'use client';

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProjectPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
