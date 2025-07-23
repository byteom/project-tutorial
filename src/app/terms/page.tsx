import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 font-headline">Terms of Service</h1>
      <p className="mb-4">By using Project Code, you agree to the following terms and conditions. Please read them carefully.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Use of Service</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must be at least 13 years old to use this platform.</li>
        <li>You agree not to misuse the platform or attempt to access it using a method other than the interface and instructions we provide.</li>
        <li>You are responsible for maintaining the confidentiality of your account information.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Content</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All content provided is for educational purposes only.</li>
        <li>You may not copy, distribute, or use content from this site for commercial purposes without permission.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
      <p className="mb-4">Project Code is provided "as is" without warranties of any kind. We are not liable for any damages or losses resulting from your use of the platform.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Changes to Terms</h2>
      <p className="mb-4">We may update these terms from time to time. Continued use of the platform constitutes acceptance of the new terms.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact</h2>
      <p>If you have questions about these Terms of Service, please contact us via the Help Center.</p>
    </main>
  );
} 