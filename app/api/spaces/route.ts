import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const ownerId = session.user.id;
    const { name } = body;
    if (!name || !ownerId) {
      return NextResponse.json(
        { message: "Name and ownerId is required" },
        { status: 400 }
      );
    }
    const space = await prisma.space.create({
      data: {
        name,
        ownerId,
      },
    });

    return NextResponse.json({ space }, { status: 201 });
  } catch (error) {
    console.log("Error creating space", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ownerId = session.user.id;

    const spaces = await prisma.space.findMany({
      where: { ownerId },
      include: { reviews: true },
    });

    return NextResponse.json({ spaces }, { status: 200 });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
