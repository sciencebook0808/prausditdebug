"use client";

import { SignUp } from "@clerk/nextjs";

export default function ClerkSignUpWidget() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      fallbackRedirectUrl="/"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-card border border-border shadow-none",
        },
      }}
    />
  );
}
