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

    const { name, slug, introduction, heroImage, status } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this slug already exists" },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        name,
        slug,
        introduction: introduction || null,
        heroImage: heroImage || null,
        status: status || "draft",
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
