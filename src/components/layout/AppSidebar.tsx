
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Book, Code, Cpu, FlaskConical, GitBranch, GraduationCap, LayoutDashboard, Settings, BotMessageSquare, ChevronDown, ToyBrick, RefreshCcw, Orbit } from 'lucide-react';
import { useTokenUsage } from '@/hooks/use-token-usage';
import { useProjects } from '@/hooks/use-projects';

export function AppSidebar() {
  const { tokenCount } = useTokenUsage();
  const { projects } = useProjects();

  const ongoingProjects = projects.filter(p => {
    if (!p.steps) return false;
    const allSubTasks = p.steps.flatMap(s => s.subTasks || []);
    if (allSubTasks.length === 0) return false;
    const completedCount = allSubTasks.filter(st => st && st.completed).length;
    return completedCount > 0 && completedCount < allSubTasks.length;
  });

  const topTracks = [
    { name: "Web Development", icon: <Code /> },
    { name: "Full-Stack SpringBoot", icon: <GitBranch /> },
    { name: "Machine Learning", icon: <FlaskConical /> },
    { name: "React & Node.js", icon: <Code /> },
    { name: "C++", icon: <Code /> },
    { name: "Python", icon: <Code /> },
  ]

  return (
    <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                    <Cpu />
                </Button>
                <span className="font-bold font-headline text-lg">PROJECTAI</span>
            </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col p-2">
            <div className="flex-1">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/project-practice">
                            <SidebarMenuButton isActive>
                                <LayoutDashboard />
                                Projects
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/learn">
                            <SidebarMenuButton>
                                <BotMessageSquare />
                                Learn Anything
                                <Badge variant="secondary" className="ml-auto">BETA</Badge>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel>Top Tracks</SidebarGroupLabel>
                    <SidebarMenu>
                        {topTracks.map((track) => (
                            <SidebarMenuItem key={track.name}>
                                <SidebarMenuButton>
                                    {track.icon}
                                    {track.name}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <ChevronDown />
                                Show All
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </div>

            <div className="mt-auto">
                <SidebarGroup>
                    <SidebarGroupLabel>Usage</SidebarGroupLabel>
                    <div className="flex items-center justify-between p-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ToyBrick className="h-4 w-4" />
                            <span>Tokens Used</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">{tokenCount.toLocaleString()}</span>
                        </div>
                    </div>
                </SidebarGroup>
                
                {ongoingProjects.length > 0 && (
                    <SidebarGroup className="mt-2">
                        <SidebarGroupLabel>Ongoing Projects</SidebarGroupLabel>
                        <SidebarMenu>
                            {ongoingProjects.map((project) => (
                                <SidebarMenuItem key={project.id}>
                                    <Link href={`/projects/${project.id}`}>
                                        <SidebarMenuButton>
                                            <Orbit className="text-green-500"/>
                                            <span className="truncate">{project.title}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </div>
        </SidebarContent>
        <SidebarFooter className="p-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>OS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">Om singh</p>
                </div>
            </div>
             <p className='text-xs text-center text-muted-foreground pt-4'>
                Made with ❤️ by certifyo-omsingh
            </p>
        </SidebarFooter>
    </Sidebar>
  );
}
