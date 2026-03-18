import type { Metadata } from "next";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";
import type { DbUser } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage() {
  if (!isDatabaseConfigured) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Database not configured.</p>
        </div>
      </div>
    );
  }

  let users: DbUser[] = [];
  try {
    const results = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    users = results as DbUser[];
  } catch (error) {
    console.error("Users page query error:", error);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-muted-foreground">Manage platform users and roles.</p>
      </div>
      <UsersClient users={users} />
    </div>
  );
}
