
"use client";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export default function AuthPage() {
  const { user, loading, error, signIn, signUp, signInWithProvider } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const authAction = mode === "login" ? signIn : signUp;
    try {
        await authAction(email, password);
    } catch (err: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: err.message || "An unexpected error occurred.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    try {
      await signInWithProvider(provider);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Social Login Failed",
        description: err.message || `Could not sign in with ${provider}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full p-8 border rounded-lg shadow-lg bg-card text-card-foreground"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold font-headline mb-2 text-primary">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "login" ? "Sign in to continue your journey." : "Join us and start building today."}
            </p>
          </div>

          <div className="space-y-3">
             <p className="text-sm text-center text-muted-foreground font-semibold">Recommended: One-click sign-in</p>
             <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" type="button" className="flex-1" onClick={() => handleSocialLogin('google')} disabled={isSubmitting}>
                  <FaGoogle className="mr-2" /> Sign in with Google
                </Button>
                <Button variant="outline" type="button" className="flex-1" onClick={() => handleSocialLogin('github')} disabled={isSubmitting}>
                  <FaGithub className="mr-2" /> Sign in with GitHub
                </Button>
            </div>
          </div>
          

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
            {(isSubmitting || loading) && <Loader2 className="animate-spin" />}
            {mode === "login" ? "Login with Email" : "Sign Up with Email"}
          </Button>
          <div className="text-center text-sm mt-2">
            {mode === "login" ? (
              <span>
                Don't have an account?{' '}
                <button type="button" className="text-primary hover:underline font-semibold" onClick={() => setMode("signup")}>Sign Up</button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" className="text-primary hover:underline font-semibold" onClick={() => setMode("login")}>Login</button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
