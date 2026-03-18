"use client";

import { lazy, Suspense } from "react";
import { AlertTriangle } from "lucide-react";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const ClerkSignUpWidget = clerkEnabled
  ? lazy(() => import("@/components/clerk-sign-up-widget"))
  : null;

function AuthNotConfigured() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">
            Sign Up Unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authentication is not configured for this instance.
          </p>
        </div>
      </div>
    </section>
  );
}

export function SignUpPageClient() {
  if (!ClerkSignUpWidget) {
    return <AuthNotConfigured />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Join Prausdit
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Create Your Account
          </h1>
        </div>
        <Suspense fallback={null}>
          <ClerkSignUpWidget />
        </Suspense>
      </div>
    </section>
  );
}
