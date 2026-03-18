"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AppWindow,
  FileText,
  Inbox,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DbUser } from "@/lib/types";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Lazily load the Clerk UserButton only when keys are available.
 * Uses the same lazy-import pattern as the Navbar for consistency.
 */
const LazyUserButton = clerkEnabled
  ? lazy(() =>
      import("@clerk/nextjs").then((mod) => ({
        default: mod.UserButton,
      }))
    )
  : null;

function ClerkUserButtonSafe() {
  if (!LazyUserButton) return null;
  return (
    <Suspense fallback={<div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />}>
      <LazyUserButton />
    </Suspense>
  );
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: AppWindow },
  { href: "/admin/documentation", label: "Documentation", icon: FileText },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: { user: DbUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Prausdit Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">Prausdit</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon size={18} />
              {item.label}
              {isActive(item.href) && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="flex items-center gap-3 border-t border-border px-5 py-4">
        <ClerkUserButtonSafe />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground capitalize">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card border border-border p-2 text-foreground shadow-sm md:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 shrink-0 md:block">
        {sidebarContent}
      </aside>
    </>
  );
}
