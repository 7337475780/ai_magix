import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Validate prompt input
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ err: "Prompt is required" }, { status: 400 });
    }

    // Environment variables for RapidAPI
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const RAPID_API_HOST = process.env.RAPID_API_HOST;

    if (!RAPID_API_KEY || !RAPID_API_HOST) {
      return NextResponse.json(
        { err: "Missing RapidAPI credentials" },
        { status: 500 }
      );
    }

    // Prevent overly long prompts
    const safePrompt = prompt.slice(0, 300);
    console.log("📤 Sending prompt:", safePrompt);

    // Send request to RapidAPI
    const response = await fetch(
      "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": RAPID_API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
        body: JSON.stringify({
          prompt: safePrompt,
          style_id: 4,
          size: "1-1",
        }),
      }
    );

    // Always read raw text in case JSON is malformed
    const raw = await response.text();

    if (!response.ok) {
      console.error(`RapidAPI error (${response.status}):`, raw);
      return NextResponse.json(
        { err: "Failed to generate image" },
        { status: 500 }
      );
    }

    // Parse the JSON safely
    let result;
    try {
      result = JSON.parse(raw);
    } catch (jsonErr) {
      console.error("Failed to parse JSON:", raw);
      return NextResponse.json(
        { err: "Invalid JSON from image API" },
        { status: 500 }
      );
    }

    // Extract image URLs
    const imageUrls = result.final_result?.map((img: any) => img.origin) ?? [];

    if (imageUrls.length === 0) {
      return NextResponse.json({ err: "No image returned" }, { status: 500 });
    }

    // Success response
    return NextResponse.json({ imageUrls });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ err: "Something went wrong." }, { status: 500 });
  }
}
