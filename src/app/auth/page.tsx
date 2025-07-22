"use client";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

export default function AuthPage() {
  const { user, loading, error, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div>Welcome, {user.email}!</div>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (mode === "login") {
            await signIn(email, password);
          } else {
            await signUp(email, password);
          }
        }}
        className="flex flex-col gap-4 w-80 p-8 border rounded shadow bg-white"
      >
        <h2 className="text-2xl font-bold mb-2">{mode === "login" ? "Login" : "Sign Up"}</h2>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full">
          {mode === "login" ? "Login" : "Sign Up"}
        </Button>
        <div className="text-center text-sm mt-2">
          {mode === "login" ? (
            <span>
              Don't have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setMode("signup")}>Sign Up</button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setMode("login")}>Login</button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
} 