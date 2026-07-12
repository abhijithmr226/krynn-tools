import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenRouter(body: object): Promise<Response> {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://krynntools.online",
      "X-Title": "Krynn Tools",
    },
    body: JSON.stringify(body),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    let lastError: { status: number; body: unknown } | null = null;

    for (const model of MODELS) {
      const body = {
        model,
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 8192,
      };

      let res = await callOpenRouter(body);

      for (let attempt = 0; attempt < MAX_RETRIES && (res.status === 429 || res.status === 503); attempt++) {
        console.warn(`${model} returned ${res.status}, retrying in ${RETRY_DELAY_MS}ms`);
        await delay(RETRY_DELAY_MS * (attempt + 1));
        res = await callOpenRouter(body);
      }

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return NextResponse.json({ text });
        }
      }

      const errBody = await res.json().catch(() => null);
      lastError = { status: res.status, body: errBody };
      console.warn(`${model} failed (${res.status}):`, JSON.stringify(errBody));
    }

    const status = lastError?.status ?? 500;
    if (status === 429) {
      return NextResponse.json(
        { error: "AI service is temporarily at capacity. Please try again in a minute." },
        { status: 429 }
      );
    }

    if (status === 402) {
      return NextResponse.json(
        { error: "AI service credits exhausted. Please contact support." },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status }
    );
  } catch (err) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
