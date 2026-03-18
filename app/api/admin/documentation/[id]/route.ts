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
    if (body.content !== undefined) data.content = body.content;
    if (body.title !== undefined) data.title = body.title;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

    const doc = await prisma.documentation.update({
      where: { id: numId },
      data,
    });

    return NextResponse.json({ doc });
  } catch (error) {
    console.error("Update documentation error:", error);
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

    await prisma.documentation.delete({
      where: { id: numId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete documentation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
