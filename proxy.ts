import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerkKeysAvailable =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

async function withClerkMiddleware(req: NextRequest) {
  // Dynamically import Clerk middleware only when keys are present.
  // This prevents build/runtime crashes when Clerk is not configured.
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );
  const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

  return clerkMiddleware(async (auth, request) => {
    if (isAdminRoute(request)) {
      await auth.protect();
    }
  })(req, {} as never);
}

export default async function middleware(req: NextRequest) {
  if (clerkKeysAvailable) {
    return withClerkMiddleware(req);
  }
  // Without Clerk, block admin routes and let everything else through.
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
