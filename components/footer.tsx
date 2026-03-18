import Link from "next/link";
import Image from "next/image";
import { Github, FileText, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Prausdit Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-foreground">
                Prausdit
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Engineering the AI-Native Future.
            </p>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <Link
              href="/protroit-os"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Protroit OS
            </Link>
            <Link
              href="/protroit-os/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin Login
            </Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/prausdit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <Link
                href="/protroit-os/docs"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Documentation"
              >
                <FileText size={20} />
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Contact"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Prausdit. All rights reserved.
            Building responsible AI systems for tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
