import type { Metadata } from "next";
import { SignUpPageClient } from "@/components/sign-up-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Prausdit account.",
};

export default function SignUpPage() {
  return <SignUpPageClient />;
}
