import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await prisma.generation.findMany({
      where: { userEmail: session.user.email },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ history });
  } catch (err) {
    console.error("Error fetching history : ", err);
    return NextResponse.json(
      { err: "Failed to load history" },
      { status: 500 }
    );
  }
}
