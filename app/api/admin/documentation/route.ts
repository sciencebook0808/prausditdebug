import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, title, slug, parentId, content, sortOrder } =
      await req.json();

    if (!applicationId || !title || !slug) {
      return NextResponse.json(
        { error: "applicationId, title, and slug are required" },
        { status: 400 }
      );
    }

    const doc = await prisma.documentation.create({
      data: {
        applicationId: parseInt(applicationId),
        title,
        slug,
        parentId: parentId ? parseInt(parentId) : null,
        content: content || "",
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ doc });
  } catch (error) {
    console.error("Create doc error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
