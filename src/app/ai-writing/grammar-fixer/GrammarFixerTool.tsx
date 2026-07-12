"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function GrammarFixerTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Fix all grammar, spelling, punctuation, and syntax errors in the following text. Return ONLY the corrected text, with no explanations or commentary:\n\n${input}`,
          systemInstruction: "You are an expert grammar checker. Fix all errors in the text while preserving the original meaning, tone, and style. Return only the corrected text.",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.text);
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    try {
      const parsed = JSON.parse(output);
      navigator.clipboard.writeText(parsed.corrected);
    } catch {
      navigator.clipboard.writeText(output);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const renderOutput = () => {
    try {
      const parsed = JSON.parse(output);
      return (
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-green-500/10 p-3">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-green-500">
              Corrected Text
            </span>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {parsed.corrected}
            </p>
          </div>
        </div>
      );
    } catch {
      return (
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
          {output}
        </div>
      );
    }
  };

  return (
    <ToolLayout
      title="AI Grammar Fixer"
      subtitle="Fix grammar, spelling, and punctuation errors in your text instantly."
      howToUse={[
        "Paste your text with errors into the text area below.",
        "Click the Fix Grammar button to let AI analyze your text.",
        "Review the corrected version with highlighted changes.",
        "Copy the corrected text to your clipboard when satisfied.",
      ]}
      faq={[
        {
          question: "What types of errors does it fix?",
          answer:
            "The tool corrects grammar mistakes, spelling errors, punctuation issues, subject-verb agreement, and common writing mistakes.",
        },
        {
          question: "Will it change my writing style?",
          answer:
            "No. The grammar fixer preserves your original tone and style while correcting errors. Only mistakes are fixed, not your voice.",
        },
        {
          question: "How long can the input text be?",
          answer:
            "You can paste up to 5,000 characters at a time. For longer texts, break them into paragraphs and process each separately.",
        },
        {
          question: "Is my text kept private?",
          answer:
            "Yes. Your text is processed in real time and never stored on our servers. Complete privacy is guaranteed.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Text with Errors
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here and we'll fix any grammar, spelling, or punctuation errors..."
            rows={6}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Fixing grammar...
            </span>
          ) : (
            "Fix Grammar"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Corrected Text
              </h3>
              <button
                onClick={handleCopy}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
            {renderOutput()}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
