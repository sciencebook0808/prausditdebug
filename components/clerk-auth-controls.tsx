"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Clerk auth controls component. This file is lazily imported only when
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set. Because it is always wrapped
 * in a ClerkProvider (via ClerkProviderWrapper), hooks are safe to call.
 */
export default function ClerkAuthControls({
  variant,
}: {
  variant: "desktop" | "mobile";
}) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (variant === "mobile") {
    if (isSignedIn) {
      return (
        <div className="flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-muted-foreground">Account</span>
        </div>
      );
    }
    return (
      <SignInButton mode="modal">
        <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          Sign In
        </Button>
      </SignInButton>
    );
  }

  // Desktop variant
  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
    );
  }

  return (
    <SignInButton mode="modal">
      <Button
        size="sm"
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-all duration-300 hover:shadow-md"
      >
        Sign In
      </Button>
    </SignInButton>
  );
}
