"use client";

import { useUser } from "@clerk/nextjs";
import { ContactFormFields } from "@/components/contact-form";

/**
 * Lazily loaded component that uses Clerk's useUser() hook to
 * pre-fill the contact form with the authenticated user's name and email.
 * This file is only imported when Clerk is configured.
 */
export default function ClerkContactPrefill({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { user, isSignedIn } = useUser();

  return (
    <ContactFormFields
      loading={loading}
      onSubmit={onSubmit}
      defaultName={isSignedIn ? user?.fullName || "" : ""}
      defaultEmail={
        isSignedIn ? user?.emailAddresses?.[0]?.emailAddress || "" : ""
      }
    />
  );
}
