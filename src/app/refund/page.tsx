import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 font-headline">Refund Policy</h1>
      <p>Strictly no refund policy. All purchases are final.</p>
    </main>
  );
} 