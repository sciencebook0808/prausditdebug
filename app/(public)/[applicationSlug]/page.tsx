import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    });
    if (!app || app.status !== "published") return { title: "Not Found" };
    return {
      title: app.name,
      description: app.introduction || `${app.name} by Prausdit`,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationSlug: string }>;
}) {
  if (!isDatabaseConfigured) notFound();

  const { applicationSlug } = await params;

  let app;
  let docs: { id: number; title: string; slug: string }[] = [];
  try {
    app = await prisma.application.findUnique({
      where: { slug: applicationSlug },
    });
    if (!app || app.status !== "published") notFound();

    docs = await prisma.documentation.findMany({
      where: { applicationId: app.id, parentId: null },
      orderBy: { sortOrder: "asc" },
      take: 6,
      select: { id: true, title: true, slug: true },
    });
  } catch (error) {
    console.error("Application page query error:", error);
    notFound();
  }

  return (
    <section className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-4xl">
        {app.heroImage && (
          <div className="mb-8 overflow-hidden rounded-2xl neon-border-cyan">
            <Image
              src={app.heroImage}
              alt={app.name}
              width={1200}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-bold text-foreground text-balance md:text-5xl">
          {app.name}
        </h1>

        {app.introduction && (
          <div
            className="prose-docs mb-8 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: app.introduction }}
          />
        )}

        {docs.length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Documentation
              </h2>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <Link href={`/${applicationSlug}/docs`}>
                  View All
                  <ArrowRight size={14} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        )}

        <div className="mt-12 flex items-center gap-4">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={`/${applicationSlug}/docs`}>
              <BookOpen size={16} className="mr-2" />
              Read Documentation
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
