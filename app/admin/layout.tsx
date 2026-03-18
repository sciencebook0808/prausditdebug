import { redirect } from "next/navigation";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { resolveRole, isClerkConfigured } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AccessDenied } from "@/components/admin/access-denied";
import type { DbUser } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Clerk is not configured, show a configuration warning
  if (!isClerkConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="mb-2 text-xl font-bold text-foreground">
            Admin Not Available
          </h1>
          <p className="text-sm text-muted-foreground">
            Authentication is not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable admin access.
          </p>
        </div>
      </div>
    );
  }

  // If database is not configured, show a database warning
  if (!isDatabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="mb-2 text-xl font-bold text-foreground">
            Database Not Configured
          </h1>
          <p className="text-sm text-muted-foreground">
            Set the DATABASE_URL environment variable to enable the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  try {
    const { auth, currentUser } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    if (!userId) redirect("/login");

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      const clerkUser = await currentUser();
      if (!clerkUser) redirect("/login");

      const name =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User";
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const role = resolveRole(email);

      dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        create: { clerkId: userId, name, email, role },
        update: { name, email },
      });
    } else {
      const expectedRole = resolveRole(dbUser.email);
      if (expectedRole === "admin" && dbUser.role !== "admin") {
        dbUser = await prisma.user.update({
          where: { clerkId: userId },
          data: { role: expectedRole },
        });
      }
    }

    if (dbUser.role !== "admin" && dbUser.role !== "developer") {
      return <AccessDenied />;
    }

    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar user={dbUser as DbUser} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  } catch (error) {
    console.error("Admin layout error:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-2 text-xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            The admin dashboard encountered an error. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
