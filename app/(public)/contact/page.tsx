import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Prausdit team. Inquiries about Protroit OS, partnerships, and developer access.",
};

export default function ContactPage() {
  return (
    <section className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Contact
          </p>
          <h1 className="mb-4 text-3xl font-bold text-foreground text-balance md:text-4xl">
            Get in Touch
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Have a question about Prausdit or Protroit OS? Want to collaborate or
            contribute? Send us a message.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
