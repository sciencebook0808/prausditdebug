import type { Metadata } from "next";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import Link from "next/link";
import { FileText, ArrowRight, AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Documentation",
};

export default async function DocumentationPage() {
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

  let apps: Awaited<ReturnType<typeof prisma.application.findMany>> = [];
  try {
    apps = await prisma.application.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { documentation: true },
        },
      },
    });
  } catch (error) {
    console.error("Documentation page query error:", error);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
        <p className="mt-1 text-muted-foreground">
          Manage documentation across applications.
        </p>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-12 text-center">
          <FileText
            size={40}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-muted-foreground">
            No applications yet. Create an application first.
          </p>
          <Link
            href="/admin/applications"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Go to Applications
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{app.name}</h3>
                <ArrowRight size={16} className="text-muted-foreground" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                /{app.slug}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {app._count.documentation} documentation page
                {app._count.documentation !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
