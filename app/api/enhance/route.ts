import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ err: "Prompt is required" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY!;
    if (!API_KEY) {
      return NextResponse.json(
        { err: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const systemPrompt = `
You are an expert AI image prompt enhancer. Output only a single vivid and highly descriptive version of the given prompt. 
Respond with just the enhanced prompt on one line, no categories, titles, or explanation.
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt.trim()}\n\nOriginal Prompt: ${prompt}` },
          ],
        },
      ],
    };

    const res = await fetch(`${apiUrl}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { err: "Failed to enhance prompt" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Extract raw content safely
    const raw: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Clean: extract first non-empty line, strip bullets if present
    let enhancedPrompt =
      raw
        .split("\n")
        .find((line) => line.trim().length > 10) // find first good line
        ?.replace(/^[-*]\s*/, "")
        .trim() || "";

    // Final fallback
    if (enhancedPrompt.length < 10) {
      console.warn(
        "Gemini returned invalid enhancement. Using original prompt."
      );
      enhancedPrompt = prompt;
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ err: "Something went wrong" }, { status: 500 });
  }
}
