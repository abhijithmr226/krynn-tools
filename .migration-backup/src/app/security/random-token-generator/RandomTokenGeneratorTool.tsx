"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type CharSet = "alphanumeric" | "hex" | "base64";

const charSets: Record<CharSet, string> = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789abcdef",
  base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
};

export default function RandomTokenGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [length, setLength] = useState(32);
  const [charSet, setCharSet] = useState<CharSet>("alphanumeric");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = charSets[charSet];
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    setToken(Array.from(array, (v) => chars[v % chars.length]).join(""));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      howToUse={howToUse}
      faq={faq}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Token Length: <span className="text-[var(--color-primary)]">{length}</span>
            </label>
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Character Set</label>
            <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
              {(["alphanumeric", "hex", "base64"] as const).map((cs) => (
                <button
                  key={cs}
                  onClick={() => setCharSet(cs)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                    charSet === cs
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  }`}
                >
                  {cs}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-6 w-full cursor-pointer">
          Generate Token
        </button>

        {token && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Generated Token</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-sm break-all text-[var(--color-foreground)]">
                {token}
              </div>
              <button
                onClick={handleCopy}
                className="btn-secondary shrink-0 cursor-pointer px-4 py-3"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
