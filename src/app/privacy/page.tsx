import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Link href="/" className="mb-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 font-headline">Privacy Policy</h1>
      <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use Project Code.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Personal Information: such as your name, email address, and profile information when you register or contact us.</li>
        <li>Usage Data: information about how you use the site, including pages visited, features used, and time spent.</li>
        <li>Cookies: we use cookies to enhance your experience and analyze site usage.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and improve our services.</li>
        <li>To communicate with you about updates, support, or promotional offers.</li>
        <li>To ensure the security and integrity of our platform.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Data Sharing</h2>
      <p className="mb-4">We do not sell your personal information. We may share data with trusted third-party service providers only as necessary to operate and improve our services, or as required by law.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Your Choices</h2>
      <p className="mb-4">You can update or delete your account information at any time. You may also opt out of non-essential communications.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact</h2>
      <p>If you have questions about this Privacy Policy, please contact us via the Help Center.</p>
    </main>
  );
} 