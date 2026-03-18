"use client";

import { SignIn } from "@clerk/nextjs";

export default function ClerkSignInWidget() {
  return (
    <SignIn
      routing="hash"
      fallbackRedirectUrl="/admin"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-card border border-border shadow-none",
        },
      }}
    />
  );
}
