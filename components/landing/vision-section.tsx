export function VisionSection() {
  return (
    <section className="section-alt py-24 px-6 bg-secondary/20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
          Our Vision
        </p>
        <h2 className="mb-8 text-3xl font-bold text-foreground text-balance md:text-4xl">
          Toward Responsible Intelligence
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We are building toward a future where artificial general intelligence
          emerges from principled engineering, not reckless scaling. Every system
          we design prioritizes safety, interpretability, and human alignment.
          The path to AGI must be deliberate, transparent, and grounded in
          rigorous research.
        </p>
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="mt-1 text-sm text-muted-foreground">On-Device Inference</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">0</p>
            <p className="mt-1 text-sm text-muted-foreground">Cloud Dependencies</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">Open</p>
            <p className="mt-1 text-sm text-muted-foreground">SDK Ecosystem</p>
          </div>
        </div>
      </div>
    </section>
  );
}
