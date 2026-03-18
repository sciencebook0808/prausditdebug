import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/** Whether a DATABASE_URL is configured. Safe to check at module-evaluation time. */
export const isDatabaseConfigured = !!process.env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a Proxy that throws a clear error on any property access attempt.
    // This prevents the app from crashing at import time while still surfacing
    // the issue when a database call is actually attempted.
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Allow Symbol and internal property access (required by Next.js / serialization)
        if (typeof prop === "symbol" || prop === "then" || prop === "toJSON") {
          return undefined;
        }
        throw new Error(
          `Database is not configured. Set the DATABASE_URL environment variable. (Attempted to access prisma.${String(prop)})`
        );
      },
    });
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
