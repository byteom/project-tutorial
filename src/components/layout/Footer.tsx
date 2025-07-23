import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-10 mt-12 text-foreground/80">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left: Info Links */}
        <div className="flex flex-col gap-2 min-w-[180px]">
          <h3 className="font-bold text-lg mb-2">About</h3>
          <Link href="/about" className="hover:underline">About Us</Link>
          <Link href="/career" className="hover:underline">Careers</Link>
          <Link href="/contact" className="hover:underline">Help Center</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/refund" className="hover:underline">Refund Policy</Link>
        </div>
        {/* Center: Logo/Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline font-bold text-2xl tracking-tight">Project Code</span>
          <span className="text-sm text-muted-foreground">Learn by Building Real-World Projects</span>
        </div>
        {/* Right: Social Links */}
        <div className="flex flex-col gap-2 min-w-[180px]">
          <h3 className="font-bold text-lg mb-2">Connect With Us</h3>
          <div className="flex gap-4 mt-1">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary"><FaTwitter size={22} /></a>
            <a href="https://github.com/byteom" target="_blank" rel="noopener noreferrer" aria-label="GitHub: byteom" className="hover:text-primary"><FaGithub size={22} /></a>
            <a href="https://www.linkedin.com/in/byteom/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn: byteom" className="hover:text-primary"><FaLinkedin size={22} /></a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Project Code. All rights reserved.
      </div>
    </footer>
  );
} 