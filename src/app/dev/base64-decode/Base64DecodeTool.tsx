"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function Base64DecodeTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDecode = useCallback(() => {
    setError("");
    try {
      setOutput(atob(input));
    } catch {
      setError("Invalid Base64 string. Please check your input.");
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Base64 Decoder Online Free"
      subtitle="Decode Base64 strings to plain text instantly."
      howToUse={[
        "Paste your Base64-encoded string into the input area.",
        "Click Decode to convert it to plain text.",
        "Copy the decoded output to your clipboard.",
      ]}
      faq={[
        { question: "What is Base64?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text. It's commonly used for encoding data in emails, URLs, and data URIs." },
        { question: "Will it handle invalid input?", answer: "If the input is not valid Base64, an error message will be shown. Make sure your input only contains valid Base64 characters." },
        { question: "What if I need to encode too?", answer: "Use our Base64 Encoder/Decoder tool at /dev/base64-encode for both encoding and decoding." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Base64 string here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecode}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Decode Base64
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
              Decoded Output:
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
