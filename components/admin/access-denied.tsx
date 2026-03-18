import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-20 blur-[120px] dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[40vh] w-[50vw] translate-x-1/4 translate-y-1/4 rounded-full opacity-15 blur-[100px] dark:opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/60 bg-secondary/50 backdrop-blur-sm neon-glow-cyan">
          <ShieldX className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          Access Restricted
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-muted-foreground text-pretty">
          You do not have permission to view this page.
        </p>

        <Button
          asChild
          size="lg"
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
