import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { isClerkConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isClerkConfigured) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }
    if (!isDatabaseConfigured) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { role } = await req.json();

    if (!["user", "developer", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: numId },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
