"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RemoveExtraSpacesTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleClean = useCallback(() => {
    const cleaned = input
      .replace(/\t/g, " ")
      .replace(/ +/g, " ")
      .replace(/ +\n/g, "\n")
      .replace(/\n +/g, "\n")
      .replace(/^\s+|\s+$/gm, "")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
    setOutput(cleaned);
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Remove Extra Spaces Online Free"
      subtitle="Remove extra whitespace, tabs, and trailing spaces from text instantly."
      howToUse={[
        "Paste your text into the input area below.",
        "Click the Clean button to remove extra spaces, tabs, and trailing whitespace.",
        "Copy the cleaned text to your clipboard.",
      ]}
      faq={[
        { question: "What spaces are removed?", answer: "The tool removes multiple consecutive spaces, trailing spaces on each line, extra tabs, and leading/trailing whitespace from the entire text." },
        { question: "Will it remove single spaces between words?", answer: "No. Single spaces between words are preserved. Only consecutive extra spaces are collapsed to one." },
        { question: "Is my text stored?", answer: "No. All processing happens in your browser. Your text never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClean}
            disabled={!input}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Clean Spaces
          </button>
          {output && (
            <button
              onClick={handleCopy}
              className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Cleaned Text:
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
