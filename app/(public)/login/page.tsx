import type { Metadata } from "next";
import { LoginPageClient } from "@/components/login-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login for the Prausdit platform.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
