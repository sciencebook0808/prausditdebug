"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Lazily loaded Clerk-aware auth controls.
 * The component only mounts when clerkEnabled is true, so hook rules are satisfied.
 */
const ClerkAuthControls = clerkEnabled
  ? lazy(() => import("@/components/clerk-auth-controls"))
  : null;

function AuthControls({ variant }: { variant: "desktop" | "mobile" }) {
  if (!ClerkAuthControls) return null;
  return (
    <Suspense fallback={null}>
      <ClerkAuthControls variant={variant} />
    </Suspense>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/protroit-os", label: "Protroit OS" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2">
      <div
        className={`rounded-full border px-6 py-2.5 transition-all duration-500 ease-in-out ${
          scrolled
            ? "border-border/40 bg-card/80 shadow-lg backdrop-blur-2xl dark:bg-card/60 dark:border-border/30 dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "border-transparent bg-card/40 backdrop-blur-xl dark:bg-card/20"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.png"
              alt="Prausdit Logo"
              width={32}
              height={32}
              className="rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-base font-bold tracking-tight text-foreground">
              Prausdit
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary/60"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Theme Toggle + Auth */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <AuthControls variant="desktop" />
          </div>

          {/* Mobile: Sheet Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-foreground"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2.5">
                    <Image
                      src="/images/logo.png"
                      alt="Prausdit Logo"
                      width={28}
                      height={28}
                      className="rounded-md"
                    />
                    <span>Prausdit</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border px-4 pt-4">
                  <AuthControls variant="mobile" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
