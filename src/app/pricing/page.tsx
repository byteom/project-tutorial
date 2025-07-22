
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the plan that\'s right for you.',
};

const FreeFeatures = [
    "AI-Powered Tutorial Generation",
    "3 Projects",
    "3 Learning Paths",
    "Community Support",
];

const ProFeatures = [
    "AI-Powered Tutorial Generation",
    "Unlimited Projects",
    "Unlimited Learning Paths",
    "Personalized Assistance",
    "Priority Support",
];

export default function PricingPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold font-headline tracking-tighter">Find the perfect plan</h1>
                <p className="text-muted-foreground mt-4 text-lg">
                    Start for free, and unlock more power when you need it.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Free</CardTitle>
                        <CardDescription>
                            For individuals just getting started with project-based learning.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-4xl font-bold">
                           $0<span className="text-lg font-normal text-muted-foreground">/month</span> 
                        </p>
                        <ul className="space-y-2">
                           {FreeFeatures.map((feature, i) => (
                             <li key={i} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                             </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>
                           Your Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                 <Card className="border-primary shadow-lg shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Pro</CardTitle>
                        <CardDescription>
                            For serious learners who want to build unlimited projects.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-4xl font-bold">
                           $10<span className="text-lg font-normal text-muted-foreground">/month</span> 
                        </p>
                        <ul className="space-y-2">
                           {ProFeatures.map((feature, i) => (
                             <li key={i} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>{feature}</span>
                             </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">
                           Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
