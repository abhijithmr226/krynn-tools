"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function ContentImproverTool({ relatedTools, schema }: Props) {
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
      await new Promise((r) => setTimeout(r, 1500));
      const sampleOutput = {
        improved: `Your improved content will appear here once the API is connected. This placeholder demonstrates the tool's layout with the improved version and suggestions panel.`,
        suggestions: [
          "Consider adding specific data points or statistics to strengthen your arguments.",
          "Break long sentences into shorter ones for better readability.",
          "Add transition words between paragraphs to improve flow.",
          "Include a clear call-to-action at the end of your content.",
        ],
      };
      setOutput(JSON.stringify(sampleOutput));
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    try {
      const parsed = JSON.parse(output);
      navigator.clipboard.writeText(parsed.improved);
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
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-green-500/10 p-3">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-green-500">
              Improved Content
            </span>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {parsed.improved}
            </p>
          </div>
          {parsed.suggestions && parsed.suggestions.length > 0 && (
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-3">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Improvement Suggestions
              </span>
              <ul className="space-y-1.5">
                {parsed.suggestions.map((s: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--color-foreground)]">
                    <span className="text-[var(--color-primary)]">&#x2022;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
      title="AI Content Improver"
      subtitle="Enhance and polish your writing for better readability and engagement."
      howToUse={[
        "Paste your content into the text area below.",
        "Click the Improve Content button to let AI enhance your text.",
        "Review the improved version along with specific suggestions.",
        "Copy the enhanced content to your clipboard when ready.",
      ]}
      faq={[
        {
          question: "How does the content improver work?",
          answer:
            "The AI analyzes your text for readability, engagement, clarity, and flow, then provides an enhanced version with actionable suggestions for further improvement.",
        },
        {
          question: "Will it change the meaning of my content?",
          answer:
            "No. The improver enhances expression and structure while preserving your original message and intent.",
        },
        {
          question: "What kind of suggestions are provided?",
          answer:
            "Suggestions cover areas like adding data, improving transitions, adjusting tone, shortening sentences, and strengthening arguments.",
        },
        {
          question: "Can I improve any type of content?",
          answer:
            "Yes. Blog posts, emails, reports, marketing copy, academic writing — the tool adapts to improve any English text content.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Content to Improve
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your blog post, email, report, or any content you want to enhance..."
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
              <span className="spinner" /> Improving content...
            </span>
          ) : (
            "Improve Content"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Improved Content
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
