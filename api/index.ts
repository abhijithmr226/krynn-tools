interface VercelRequest {
  method: string;
  body?: unknown;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
}
interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(data: unknown): void;
  end(): void;
}

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

async function callOpenRouter(body: object, apiKey: string) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Cron update endpoint to trigger Vercel deployment
  if (req.url && (req.url.includes("/api/cron-update") || req.url.includes("/cron-update"))) {
    const cronAuth = req.headers?.authorization || req.headers?.Authorization;
    const cronSecret = process.env.CRON_SECRET;

    // Verify request authenticity using Vercel CRON_SECRET if configured
    if (cronSecret && cronAuth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!deployHookUrl) {
      res.status(500).json({ error: "VERCEL_DEPLOY_HOOK_URL environment variable is not configured" });
      return;
    }

    try {
      const deployRes = await fetch(deployHookUrl, { method: "POST" });
      if (deployRes.ok) {
        res.status(200).json({ success: true, message: "Deploy hook triggered successfully" });
      } else {
        const errText = await deployRes.text();
        res.status(deployRes.status).json({ error: `Deploy hook failed: ${errText}` });
      }
    } catch (err: any) {
      res.status(500).json({ error: `Failed to trigger deploy hook: ${err.message}` });
    }
    return;
  }

  // Health check
  if (req.method === "GET") {
    const apiKey = process.env["OPENROUTER_API_KEY"];
    res.status(200).json({ configured: !!apiKey });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env["OPENROUTER_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "AI service not configured. OPENROUTER_API_KEY is missing." });
    return;
  }

  const { prompt, systemInstruction } = (req.body ?? {}) as {
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

  let lastError: { status: number } | null = null;

  for (const model of MODELS) {
    const body = {
      model,
      messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 8192,
    };

    let fetchRes = await callOpenRouter(body, apiKey);

    for (
      let attempt = 0;
      attempt < MAX_RETRIES && (fetchRes.status === 429 || fetchRes.status === 503);
      attempt++
    ) {
      await delay(RETRY_DELAY_MS * (attempt + 1));
      fetchRes = await callOpenRouter(body, apiKey);
    }

    if (fetchRes.ok) {
      const data = (await fetchRes.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data?.choices?.[0]?.message?.content;
      if (text) {
        res.status(200).json({ text });
        return;
      }
    }

    lastError = { status: fetchRes.status };
  }

  const status = lastError?.status ?? 500;
  if (status === 429) {
    res.status(429).json({ error: "AI service is temporarily at capacity. Please try again in a minute." });
    return;
  }
  if (status === 402) {
    res.status(402).json({ error: "AI service credits exhausted." });
    return;
  }

  res.status(status || 500).json({ error: "AI generation failed. Please try again." });
}
