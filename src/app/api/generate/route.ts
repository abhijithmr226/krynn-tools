import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

async function callGemini(body: object): Promise<Response> {
  return fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      ...(systemInstruction
        ? {
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          }
        : {}),
    };

    let res = await callGemini(body);

    for (let attempt = 0; attempt < MAX_RETRIES && res.status === 429; attempt++) {
      console.warn(`Gemini 429, retrying in ${RETRY_DELAY_MS}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY_MS * (attempt + 1));
      res = await callGemini(body);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const status = res.status;
      console.error("Gemini API error:", JSON.stringify(err));

      if (status === 429) {
        return NextResponse.json(
          { error: "AI service is temporarily at capacity. Please try again in a minute." },
          { status: 429 }
        );
      }

      if (status === 403) {
        return NextResponse.json(
          { error: "AI service is not available. Please contact support." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status }
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "No content generated. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
