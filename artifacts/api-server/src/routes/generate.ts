import { Router, Request, Response as ExpressResponse } from "express";
import { logger } from "../lib/logger";

const router = Router();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

// Alias the global fetch Response so it doesn't collide with Express Response.
type FetchResponse = globalThis.Response;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenRouter(body: object, apiKey: string): Promise<FetchResponse> {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://krynntools.online",
      "X-Title": "Krynn Tools",
    },
    body: JSON.stringify(body),
  });
}

// GET /api/generate — health check only, no key exposure
router.get("/generate", (_req: Request, res: ExpressResponse) => {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  res.json({ configured: !!apiKey });
});

// POST /api/generate — call OpenRouter AI with model fallback + retry
router.post("/generate", async (req: Request, res: ExpressResponse) => {
  const apiKey = process.env["OPENROUTER_API_KEY"];

  if (!apiKey) {
    res.status(500).json({
      error: "AI service not configured. OPENROUTER_API_KEY is missing.",
    });
    return;
  }

  const { prompt, systemInstruction } = req.body as {
    prompt?: string;
    systemInstruction?: string;
  };

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  const messages: Array<{ role: string; content: string }> = [];
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

    let fetchRes: FetchResponse = await callOpenRouter(body, apiKey);

    for (
      let attempt = 0;
      attempt < MAX_RETRIES && (fetchRes.status === 429 || fetchRes.status === 503);
      attempt++
    ) {
      logger.warn(`${model} returned ${fetchRes.status}, retrying in ${RETRY_DELAY_MS * (attempt + 1)}ms`);
      await delay(RETRY_DELAY_MS * (attempt + 1));
      fetchRes = await callOpenRouter(body, apiKey);
    }

    if (fetchRes.ok) {
      const data = (await fetchRes.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data?.choices?.[0]?.message?.content;
      if (text) {
        res.json({ text });
        return;
      }
    }

    const errBody = await fetchRes.json().catch(() => null);
    lastError = { status: fetchRes.status, body: errBody };
    logger.warn({ model, status: fetchRes.status, errBody }, "OpenRouter model failed");
  }

  const status = lastError?.status ?? 500;
  if (status === 429) {
    res.status(429).json({
      error: "AI service is temporarily at capacity. Please try again in a minute.",
    });
    return;
  }
  if (status === 402) {
    res.status(402).json({
      error: "AI service credits exhausted. Please contact support.",
    });
    return;
  }

  res.status(status).json({ error: "AI generation failed. Please try again." });
});

export default router;
