import { prisma, isDatabaseConfigured } from "./prisma";
import type { DbUser } from "./types";

/** Whether Clerk server keys are configured */
export const isClerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

/**
 * Resolves the role a user should be assigned based on their email.
 * If the email matches SUPER_ADMIN_EMAIL, returns "admin".
 * Otherwise returns "user".
 */
export function resolveRole(email: string): string {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (superAdminEmail && email.toLowerCase() === superAdminEmail.toLowerCase()) {
    return "admin";
  }
  return "user";
}

/**
 * Gets the current Clerk userId, returning null if Clerk is not configured
 * or the user is not authenticated.
 */
async function getClerkUserId(): Promise<string | null> {
  if (!isClerkConfigured) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<DbUser | null> {
  if (!isDatabaseConfigured) return null;
  const userId = await getClerkUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    return user as DbUser | null;
  } catch (error) {
    console.error("getAuthUser error:", error);
    return null;
  }
}

export async function syncUser(): Promise<DbUser | null> {
  if (!isClerkConfigured || !isDatabaseConfigured) return null;

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    if (!user) return null;

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email = user.emailAddresses[0]?.emailAddress || "";
    const role = resolveRole(email);

    const existing = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existing) {
      if (role === "admin" && existing.role !== "admin") {
        const promoted = await prisma.user.update({
          where: { clerkId: user.id },
          data: { name, email, role },
        });
        return promoted as DbUser;
      }
      const updated = await prisma.user.update({
        where: { clerkId: user.id },
        data: { name, email },
      });
      return updated as DbUser;
    }

    const created = await prisma.user.create({
      data: { clerkId: user.id, name, email, role },
    });
    return created as DbUser;
  } catch (error) {
    console.error("syncUser error:", error);
    return null;
  }
}

export async function requireAdmin(): Promise<DbUser | null> {
  const dbUser = await getAuthUser();
  if (!dbUser || (dbUser.role !== "admin" && dbUser.role !== "developer")) {
    return null;
  }
  return dbUser;
}

export async function requireRole(roles: string[]): Promise<DbUser | null> {
  const dbUser = await getAuthUser();
  if (!dbUser || !roles.includes(dbUser.role)) {
    return null;
  }
  return dbUser;
}
