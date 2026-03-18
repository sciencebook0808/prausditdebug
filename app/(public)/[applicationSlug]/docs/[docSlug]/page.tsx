import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { DocContent } from "@/components/docs/doc-content";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ applicationSlug: string; docSlug: string }>;
}): Promise<Metadata> {
  if (!isDatabaseConfigured) return { title: "Not Found" };
  try {
    const { applicationSlug, docSlug } = await params;
    const app = await prisma.application.findUnique({
      where: { slug: applicationSlug },
      select: { id: true, name: true, status: true },
    });
    if (!app || app.status !== "published") return { title: "Not Found" };
    const doc = await prisma.documentation.findUnique({
      where: { applicationId_slug: { applicationId: app.id, slug: docSlug } },
      select: { title: true },
    });
    if (!doc) return { title: "Not Found" };
    return { title: `${doc.title} - ${app.name}` };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ applicationSlug: string; docSlug: string }>;
}) {
  if (!isDatabaseConfigured) notFound();

  const { applicationSlug, docSlug } = await params;

  let app;
  let doc;
  let prevDoc: { id: number; title: string; slug: string } | null = null;
  let nextDoc: { id: number; title: string; slug: string } | null = null;
  let children: { id: number; title: string; slug: string }[] = [];

  try {
    app = await prisma.application.findUnique({
      where: { slug: applicationSlug },
    });
    if (!app || app.status !== "published") notFound();

    doc = await prisma.documentation.findUnique({
      where: { applicationId_slug: { applicationId: app.id, slug: docSlug } },
    });
    if (!doc) notFound();

    const allDocs = await prisma.documentation.findMany({
      where: { applicationId: app.id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, slug: true, sortOrder: true },
    });

    const currentIndex = allDocs.findIndex((d) => d.id === doc.id);
    prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
    nextDoc =
      currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

    children = await prisma.documentation.findMany({
      where: { parentId: doc.id },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, slug: true },
    });
  } catch (error) {
    console.error("Doc page query error:", error);
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <DocContent title={doc.title} content={doc.content || ""} />

      {/* Child pages */}
      {children.length > 0 && (
        <div className="mt-8 border-t border-border pt-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            In this section
          </h3>
          <div className="flex flex-col gap-2">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/${applicationSlug}/docs/${child.slug}`}
                className="rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev/Next navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-8">
        {prevDoc ? (
          <Link
            href={`/${applicationSlug}/docs/${prevDoc.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
            {prevDoc.title}
          </Link>
        ) : (
          <div />
        )}
        {nextDoc ? (
          <Link
            href={`/${applicationSlug}/docs/${nextDoc.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {nextDoc.title}
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
