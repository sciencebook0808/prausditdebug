import type { Metadata } from "next";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { InboxClient } from "@/components/admin/inbox-client";
import type { ContactSubmission } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Inbox",
};

export default async function InboxPage() {
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

  let submissions: ContactSubmission[] = [];
  try {
    const results = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    submissions = results as ContactSubmission[];
  } catch (error) {
    console.error("Inbox page query error:", error);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="mt-1 text-muted-foreground">
          Manage contact submissions.
        </p>
      </div>
      <InboxClient submissions={submissions} />
    </div>
  );
}
