import { ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const layers = [
  {
    label: "Applications",
    sub: "User-facing AI-powered apps",
    variant: "primary" as const,
  },
  {
    label: "AgentKit SDK",
    sub: "Open developer toolkit",
    variant: "primary" as const,
  },
  {
    label: "Application Framework",
    sub: "Runtime + UI + Services",
    variant: "accent" as const,
  },
  {
    label: "AI Core Engine",
    sub: "System Inference Plane + Context Graph",
    variant: "accent" as const,
  },
  {
    label: "Kernel",
    sub: "Hardened Linux + NPU Drivers",
    variant: "neutral" as const,
  },
  {
    label: "Hardware",
    sub: "CPU + GPU + NPU + Secure Enclave",
    variant: "neutral" as const,
  },
];

export function ArchitectureSection() {
  return (
    <section className="section-alt py-24 px-6 bg-secondary/20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            System Architecture
          </p>
          <h2 className="mb-6 text-3xl font-bold text-foreground text-balance md:text-4xl">
            Full-Stack AI Architecture
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every layer is purpose-built. From silicon to software, Protroit OS
            is designed as a coherent AI system.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {layers.map((layer, i) => {
            const bgClass =
              layer.variant === "primary"
                ? "border-primary/20 bg-primary/5 dark:bg-primary/10"
                : layer.variant === "accent"
                ? "border-accent/20 bg-accent/5 dark:bg-accent/10"
                : "border-border bg-secondary/50";
            const textClass =
              layer.variant === "primary"
                ? "text-primary"
                : layer.variant === "accent"
                ? "text-accent"
                : "text-foreground";

            return (
              <div key={layer.label} className="flex w-full flex-col items-center">
                <Card
                  className={`w-full rounded-xl border transition-all duration-300 hover:scale-[1.02] ${bgClass}`}
                >
                  <CardContent className="p-5 text-center">
                    <p className={`text-base font-semibold ${textClass}`}>
                      {layer.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {layer.sub}
                    </p>
                  </CardContent>
                </Card>
                {i < layers.length - 1 && (
                  <ArrowDown
                    size={20}
                    className="my-1 text-muted-foreground/40"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
