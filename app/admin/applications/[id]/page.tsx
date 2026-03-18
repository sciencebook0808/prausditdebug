import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { AppEditorClient } from "@/components/admin/app-editor-client";
import type { Application, Documentation } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Edit Application",
};

export default async function AppEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  try {
    const app = await prisma.application.findUnique({
      where: { id: numId },
    });
    if (!app) notFound();

    const docs = await prisma.documentation.findMany({
      where: { applicationId: numId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return (
      <div className="p-6 md:p-8">
        <AppEditorClient
          application={app as Application}
          documentation={docs as Documentation[]}
        />
      </div>
    );
  } catch (error) {
    console.error("App editor page query error:", error);
    notFound();
  }
}
