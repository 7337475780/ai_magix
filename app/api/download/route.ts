import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ err: "Missing image URL" }, { status: 400 });
  }
  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return NextResponse.json(
        { err: "Failed to fetch image" },
        { status: 500 }
      );
    }
    const contentType = imageRes.headers.get("content-type") || "image/webp";
    const buffer = await imageRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="download-image.webp`,
      },
    });
  } catch (err) {
    return NextResponse.json({ err: "Download Failed" }, { status: 500 });
  }
}
