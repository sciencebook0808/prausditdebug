import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { VercelAnalytics } from "@/components/analytics";
import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Prausdit - AI-Native Systems for the Next Computing Era",
    template: "%s | Prausdit",
  },
  description:
    "Prausdit engineers AI-native operating systems. Explore Protroit OS, our flagship AI-first OS with on-device intelligence, NPU-first inference, and secure AI agents.",
  keywords: [
    "AI Operating System",
    "Protroit OS",
    "Prausdit",
    "AI-native",
    "NPU inference",
    "AI agents",
    "AgentKit SDK",
  ],
  openGraph: {
    title: "Prausdit - AI-Native Systems for the Next Computing Era",
    description:
      "Engineering the AI-native future with Protroit OS and the AgentKit SDK ecosystem.",
    type: "website",
    images: ["/images/banner.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-card text-card-foreground border-border",
                },
              }}
            />
          </ThemeProvider>
        </ClerkProviderWrapper>
        <Suspense fallback={null}>
          <VercelAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
