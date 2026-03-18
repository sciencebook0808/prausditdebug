import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.introduction !== undefined) data.introduction = body.introduction;
    if (body.heroImage !== undefined) data.heroImage = body.heroImage;
    if (body.status !== undefined) data.status = body.status;

    const application = await prisma.application.update({
      where: { id: numId },
      data,
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.application.delete({
      where: { id: numId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
