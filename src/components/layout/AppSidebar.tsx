
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
import { Book, Code, Cpu, FlaskConical, GitBranch, GraduationCap, LayoutDashboard, Settings, BotMessageSquare, ChevronDown, ToyBrick, RefreshCcw } from 'lucide-react';
import { useTokenUsage } from '@/hooks/use-token-usage';

export function AppSidebar() {

  const { tokenCount, resetTokens } = useTokenUsage();

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
        <SidebarContent className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/" isActive>
                        <LayoutDashboard />
                        Projects
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/learn">
                        <BotMessageSquare />
                        Learn Anything
                        <Badge variant="secondary" className="ml-auto">BETA</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <SidebarGroup className="mt-4">
                <SidebarGroupLabel>Usage</SidebarGroupLabel>
                 <div className="flex items-center justify-between p-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ToyBrick className="h-4 w-4" />
                        <span>Tokens Used</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{tokenCount.toLocaleString()}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetTokens()}>
                          <RefreshCcw className="h-3 w-3" />
                      </Button>
                    </div>
                </div>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
                <SidebarGroupLabel>Top Tracks</SidebarGroupLabel>
                <SidebarMenu>
                    {topTracks.map((track) => (
                        <SidebarMenuItem key={track.name}>
                            <SidebarMenuButton href="#">
                                {track.icon}
                                {track.name}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#">
                            <ChevronDown />
                            Show All
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
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
