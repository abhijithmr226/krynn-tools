"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function UuidBatchGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [count, setCount] = useState(10);
  const [withDashes, setWithDashes] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.min(1000, Math.max(1, count));
    const result = Array.from({ length: n }, () => {
      const id = uuidv4();
      return withDashes ? id : id.replace(/-/g, "");
    });
    setUuids(result);
    setCopied(false);
  };

  const handleCopyAll = async () => {
    if (!uuids.length) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOne = async (id: string) => {
    await navigator.clipboard.writeText(id);
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Count: <span className="text-[var(--color-primary)]">{count}</span>
            </label>
            <input
              type="range"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>1</span>
              <span>1000</span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Format</label>
            <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
              <button
                onClick={() => setWithDashes(true)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  withDashes
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                }`}
              >
                With Dashes
              </button>
              <button
                onClick={() => setWithDashes(false)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  !withDashes
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                }`}
              >
                No Dashes
              </button>
            </div>
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-6 w-full cursor-pointer">
          Generate {count} UUID{count > 1 ? "s" : ""}
        </button>

        {uuids.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                {uuids.length} UUID{uuids.length > 1 ? "s" : ""} Generated
              </span>
              <button onClick={handleCopyAll} className="btn-secondary cursor-pointer px-4 py-2 text-sm">
                {copied ? "Copied All!" : "Copy All"}
              </button>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
              {uuids.map((id, i) => (
                <div key={i} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-[var(--color-muted)]">
                  <span className="flex-1 font-mono text-xs text-[var(--color-foreground)]">{id}</span>
                  <button
                    onClick={() => handleCopyOne(id)}
                    className="shrink-0 rounded px-2 py-1 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
