import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { BookOpen } from "lucide-react";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ applicationSlug: string }>;
}): Promise<Metadata> {
  if (!isDatabaseConfigured) return { title: "Not Found" };
  try {
    const { applicationSlug } = await params;
    const app = await prisma.application.findUnique({
      where: { slug: applicationSlug },
      select: { name: true, status: true },
    });
    if (!app || app.status !== "published") return { title: "Not Found" };
    return { title: `Documentation - ${app.name}` };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ applicationSlug: string }>;
}) {
  if (!isDatabaseConfigured) notFound();

  const { applicationSlug } = await params;

  let app;
  let docs: Awaited<ReturnType<typeof prisma.documentation.findMany>> = [];
  try {
    app = await prisma.application.findUnique({
      where: { slug: applicationSlug },
    });
    if (!app || app.status !== "published") notFound();

    docs = await prisma.documentation.findMany({
      where: { applicationId: app.id, parentId: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    console.error("Docs index page query error:", error);
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        {app.name} Documentation
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Browse the documentation to learn about {app.name}.
      </p>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <BookOpen
            size={40}
            className="mx-auto mb-3 text-muted-foreground/40"
          />
          <p className="text-muted-foreground">
            Documentation is coming soon.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/${applicationSlug}/docs/${doc.slug}`}
              className="glass rounded-xl p-5 transition-all hover:neon-glow-cyan"
            >
              <div className="flex items-center gap-3">
                <BookOpen
                  size={20}
                  className="shrink-0 text-primary"
                />
                <span className="font-medium text-foreground">
                  {doc.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
