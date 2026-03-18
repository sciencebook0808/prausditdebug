import { NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { resolveRole, isClerkConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!isClerkConfigured) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }
    if (!isDatabaseConfigured) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { auth, currentUser } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email = user.emailAddresses[0]?.emailAddress || "";
    const role = resolveRole(email);

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existing) {
      if (role === "admin" && existing.role !== "admin") {
        const promoted = await prisma.user.update({
          where: { clerkId: userId },
          data: { name, email, role },
        });
        return NextResponse.json({ user: promoted, synced: true });
      }
      const updated = await prisma.user.update({
        where: { clerkId: userId },
        data: { name, email },
      });
      return NextResponse.json({ user: updated, synced: true });
    }

    const created = await prisma.user.create({
      data: { clerkId: userId, name, email, role },
    });

    return NextResponse.json({ user: created, synced: true });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
