"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type HashType = "MD5" | "SHA1" | "SHA256" | "SHA512";

const HASHES: { type: HashType; fn: (s: string) => string; label: string }[] = [
  { type: "MD5", fn: (s) => CryptoJS.MD5(s).toString(), label: "MD5 (128-bit)" },
  { type: "SHA1", fn: (s) => CryptoJS.SHA1(s).toString(), label: "SHA1 (160-bit)" },
  { type: "SHA256", fn: (s) => CryptoJS.SHA256(s).toString(), label: "SHA256 (256-bit)" },
  { type: "SHA512", fn: (s) => CryptoJS.SHA512(s).toString(), label: "SHA512 (512-bit)" },
];

export default function HashGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            rows={5}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[var(--color-muted-foreground)]">
            {input.length > 0 ? `${input.length} characters` : "Enter text above to generate hashes"}
          </span>
        </div>

        <div className="space-y-3">
          {HASHES.map((hash, i) => {
            const value = input ? hash.fn(input) : "";
            return (
              <div
                key={hash.type}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-foreground)]">
                    {hash.label}
                  </span>
                  {value && (
                    <button
                      onClick={() => handleCopy(value, i)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-border)]"
                    >
                      {copiedIndex === i ? (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <pre className="overflow-x-auto break-all font-mono text-xs text-[var(--color-muted-foreground)]">
                  {value || "—"}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
