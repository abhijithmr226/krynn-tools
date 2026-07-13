"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface CaseConverterToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function toUpperCase(text: string): string {
  return text.toUpperCase();
}

function toLowerCase(text: string): string {
  return text.toLowerCase();
}

function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

function toSentenceCase(text: string): string {
  return text
    .split(/([.!?]\s*)/)
    .map((segment, i) => {
      if (i % 2 === 0 && segment.length > 0) {
        return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
      }
      return segment;
    })
    .join("");
}

function toAlternatingCase(text: string): string {
  return text
    .split("")
    .map((char, i) =>
      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
}

export default function CaseConverterTool({
  relatedTools,
  schema,
}: CaseConverterToolProps) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const cases = [
    { label: "UPPERCASE", fn: toUpperCase },
    { label: "lowercase", fn: toLowerCase },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
    { label: "aLtErNaTiNg CaSe", fn: toAlternatingCase },
  ];

  return (
    <ToolLayout
      title="Case Converter Online Free"
      subtitle="Convert text to UPPERCASE, lowercase, Title Case, or Sentence case."
      howToUse={[
        "Type or paste your text into the text area below.",
        "Click any case button to instantly convert your text.",
        "Copy the result to your clipboard with one click.",
      ]}
      faq={[
        {
          question: "What is Title Case?",
          answer:
            "Title Case capitalizes the first letter of each word. It is commonly used for headings, titles, and headlines.",
        },
        {
          question: "What is Sentence case?",
          answer:
            "Sentence case capitalizes only the first letter of each sentence, similar to how normal prose is written.",
        },
        {
          question: "Is my text stored anywhere?",
          answer:
            "No. All conversions happen in your browser. Your text is never sent to a server or stored anywhere.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
            style={{ boxShadow: "none" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <button
              key={c.label}
              onClick={() => setText(c.fn(text))}
              disabled={!text}
              className="btn-secondary"
            >
              {c.label}
            </button>
          ))}
        </div>

        {text && (
          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="btn-primary w-full"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
