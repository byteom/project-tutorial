import Link from "next/link";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-headline sm:inline-block">
              Project Code
            </span>
          </Link>
        </div>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      </div>
    </header>
  );
}