"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#0891B2",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
