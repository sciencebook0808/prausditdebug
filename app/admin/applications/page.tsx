import type { Metadata } from "next";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { ApplicationsList } from "@/components/admin/applications-list";
import type { Application } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
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

  let applications: Application[] = [];
  try {
    const results = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    applications = results as Application[];
  } catch (error) {
    console.error("Applications page query error:", error);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Manage platform applications.
        </p>
      </div>
      <ApplicationsList applications={applications} />
    </div>
  );
}
