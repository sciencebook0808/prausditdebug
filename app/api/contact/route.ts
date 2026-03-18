import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { isClerkConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { error: "Database not configured." },
        { status: 503 }
      );
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !subject || !message) {
      return NextResponse.json(
        { error: "Name, subject, and message are required." },
        { status: 400 }
      );
    }

    // Get IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";

    // Determine role type
    let roleType = "anonymous";
    if (isClerkConfigured) {
      try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { role: true },
          });
          if (dbUser) {
            roleType = dbUser.role === "developer" ? "developer" : "user";
          } else {
            roleType = "user";
          }
        }
      } catch {
        // Not authenticated -- anonymous
      }
    }

    // Check duplicate submission
    const emailStr = email && email.trim() !== "" ? email.trim() : null;

    if (emailStr) {
      const existing = await prisma.contactSubmission.findFirst({
        where: { email: emailStr },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A submission from this email already exists." },
          { status: 409 }
        );
      }
    } else {
      const existing = await prisma.contactSubmission.findFirst({
        where: { ipAddress: ip, email: null },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A submission from this IP already exists. Please provide an email for additional submissions." },
          { status: 409 }
        );
      }
    }

    await prisma.contactSubmission.create({
      data: {
        name,
        email: emailStr,
        subject,
        message,
        ipAddress: ip,
        roleType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
