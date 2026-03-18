import type { Metadata } from "next";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { isClerkConfigured } from "@/lib/auth";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  let user: { name: string; email: string; role: string; clerkId: string } | null = null;

  if (isClerkConfigured && isDatabaseConfigured) {
    try {
      const { auth } = await import("@clerk/nextjs/server");
      const { userId } = await auth();
      if (userId) {
        const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (dbUser) {
          user = { name: dbUser.name, email: dbUser.email, role: dbUser.role, clerkId: dbUser.clerkId };
        }
      }
    } catch (error) {
      console.error("Settings page error:", error);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Platform configuration.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Account Information
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium text-foreground">
              {user?.name}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
              {user?.role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Clerk ID</span>
            <span className="text-sm font-mono text-muted-foreground">
              {user?.clerkId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
