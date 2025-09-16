import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ spaceId: string }> } // params is now a Promise
) {
  try {
    const { spaceId } = await context.params; // await it!
    if (!spaceId) {
      return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { reviews: true },
    });

    return NextResponse.json(space, { status: 200 });
  } catch (error) {
    console.error("Error fetching space:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
