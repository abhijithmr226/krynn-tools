interface VercelRequest {
  method: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
}
interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  end(message?: string): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Get Authorization header
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    res.status(401).end("Unauthorized");
    return;
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl) {
    res.status(500).end("VERCEL_DEPLOY_HOOK_URL environment variable is not configured");
    return;
  }

  try {
    const deployRes = await fetch(deployHookUrl, { method: "POST" });
    if (deployRes.ok) {
      res.status(200).end("Deploy hook triggered successfully");
    } else {
      const errText = await deployRes.text();
      res.status(deployRes.status).end(`Deploy hook failed: ${errText}`);
    }
  } catch (err: any) {
    res.status(500).end(`Failed to trigger deploy hook: ${err.message}`);
  }
}
