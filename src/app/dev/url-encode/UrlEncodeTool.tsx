"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function UrlEncodeTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError("Failed to process. Check for invalid characters.");
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="URL Encoder Online Free"
      subtitle="Encode and decode URLs and query strings online."
      howToUse={[
        "Choose Encode or Decode mode.",
        "Enter your URL or string into the input area.",
        "Click process and copy the result.",
      ]}
      faq={[
        { question: "What is URL encoding?", answer: "URL encoding converts special characters into percent-encoded format so they can be safely transmitted in URLs. For example, a space becomes %20." },
        { question: "When should I use URL encoding?", answer: "Use it when inserting user input into URLs, form data, or query parameters. It ensures special characters don't break the URL structure." },
        { question: "What is the difference between encode and encodeURIComponent?", answer: "This tool uses encodeURIComponent which encodes all special characters. It's safer for encoding individual URL components." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to URL-encode..." : "Enter URL-encoded string to decode..."}
            className="min-h-[150px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={!input}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            {mode === "encode" ? "Encode URL" : "Decode URL"}
          </button>
          {output && (
            <button onClick={handleCopy} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Output:
            </label>
            <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
