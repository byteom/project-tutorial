"use client";
import { useEffect } from "react";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../../components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/project-practice");
    }
  }, [user, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-6 w-96 max-w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to ProjectAI</h1>
        <p className="text-gray-500 text-center mb-4">Sign in to continue</p>
        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 text-lg font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
          variant="outline"
        >
          <FcGoogle className="text-2xl" /> Sign in with Google
        </Button>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
} 