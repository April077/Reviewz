import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

// ✅ Use NextRequest
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ spaceId: string }> } // params is a Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { spaceId } = await context.params; // ✅ await params
    if (!spaceId) {
      return NextResponse.json(
        { success: false, error: "spaceId is required" },
        { status: 400 }
      );
    }

    const ownerId = session.user.id;

    const space = await prisma.space.findFirst({
      where: { id: spaceId, ownerId },
      include: { reviews: true },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ space }, { status: 200 });
  } catch (error) {
    console.error("Error fetching space:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ spaceId: string }> } // ✅ same here
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { spaceId } = await context.params; // ✅ await
    if (!spaceId) {
      return NextResponse.json(
        { success: false, error: "spaceId is required" },
        { status: 400 }
      );
    }

    const ownerId = session.user.id;

    const space = await prisma.space.findFirst({
      where: { id: spaceId, ownerId },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.space.delete({ where: { id: spaceId } });

    return NextResponse.json(
      { success: true, message: "Space deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting space:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
