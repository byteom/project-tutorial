
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useLearningPaths } from '@/hooks/use-learning-paths';
import { useProjects } from '@/hooks/use-projects';
import { useTokenUsage } from '@/hooks/use-token-usage';
import { useUserPreferences, type OperatingSystem } from '@/hooks/use-user-preferences';
import { BookOpen, Flame, Laptop, LogOut, ToyBrick, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { projects } = useProjects();
    const { learningPaths } = useLearningPaths();
    const { tokenCount } = useTokenUsage();
    const { operatingSystem, setOS } = useUserPreferences();

    if (!user) {
        return null;
    }
    
    const stats = [
        {
            icon: <Flame className="h-6 w-6 text-primary" />,
            label: 'Projects Started',
            value: projects.length,
        },
        {
            icon: <BookOpen className="h-6 w-6 text-primary" />,
            label: 'Learning Paths Created',
            value: learningPaths.length,
        },
        {
            icon: <ToyBrick className="h-6 w-6 text-primary" />,
            label: 'Tokens Used (24h)',
            value: tokenCount.toLocaleString(),
        },
    ];

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
            <header>
                <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
                    <UserIcon className="h-8 w-8 text-primary" />
                    My Profile
                </h1>
                <p className="text-muted-foreground mt-2">View your stats and manage your preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} alt="User Avatar" />
                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline">{user.email}</CardTitle>
                        <CardDescription>Joined on {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={signOut} variant="outline" className="w-full">
                            <LogOut className="mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Statistics</CardTitle>
                            <CardDescription>Your activity on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {stats.map((stat, index) => (
                                    <Card key={index} className="bg-secondary/50 p-4 flex flex-col items-center text-center">
                                        {stat.icon}
                                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Laptop />
                                Preferences
                            </CardTitle>
                             <CardDescription>Customize your experience.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Operating System</label>
                                <Select onValueChange={(value) => setOS(value as OperatingSystem)} value={operatingSystem}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select OS" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Windows">Windows</SelectItem>
                                        <SelectItem value="macOS">macOS</SelectItem>
                                        <SelectItem value="Linux">Linux</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    This helps us tailor generated code and commands for you.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
