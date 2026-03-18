import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* ── Layered gradient background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-background" />

        {/* Primary radial glow - top center */}
        <div
          className="absolute left-1/2 top-0 h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-30 blur-[120px] dark:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
          }}
        />

        {/* Accent radial glow - bottom right */}
        <div
          className="absolute bottom-0 right-0 h-[50vh] w-[60vw] translate-x-1/4 translate-y-1/4 rounded-full opacity-20 blur-[100px] dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
          }}
        />

        {/* Soft mesh glow - left */}
        <div
          className="absolute left-0 top-1/3 h-[40vh] w-[40vw] -translate-x-1/4 rounded-full opacity-15 blur-[80px] dark:opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
          }}
        />

        {/* Ultra-light grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Bottom fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Tagline badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          AI-Native Operating Systems
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
          Engineering the{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI-Native
          </span>{" "}
          Future
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
          Redefining operating systems with native intelligence. On-device AI
          agents that reason, predict, and act autonomously -- built from the
          silicon up.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <Link href="/protroit-os">
              Explore Protroit OS
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border-border font-medium px-8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link href="/protroit-os/docs">
              <BookOpen className="mr-2 h-4 w-4" />
              Read Architecture
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-xl font-medium px-8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link href="/contact">
              <Users className="mr-2 h-4 w-4" />
              Join Community
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
