"use client";

import { lazy, Suspense } from "react";
import { AlertTriangle } from "lucide-react";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const ClerkSignInWidget = clerkEnabled
  ? lazy(() => import("@/components/clerk-sign-in-widget"))
  : null;

function AuthNotConfigured() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">
            Sign In Unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authentication is not configured for this instance.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LoginPageClient() {
  if (!ClerkSignInWidget) {
    return <AuthNotConfigured />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Admin Access
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Sign In to Prausdit
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only authorized administrators and developers can access the
            dashboard.
          </p>
        </div>
        <Suspense fallback={null}>
          <ClerkSignInWidget />
        </Suspense>
      </div>
    </section>
  );
}
