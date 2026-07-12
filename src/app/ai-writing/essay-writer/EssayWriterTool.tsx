"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function EssayWriterTool({ relatedTools, schema }: Props) {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState("1000");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a well-structured essay of approximately ${wordCount} words on the following topic:\n\n${topic}\n\nInclude an engaging introduction, detailed body paragraphs with supporting evidence, and a strong conclusion.`,
          systemInstruction: "You are an expert essay writer. Write well-structured, insightful essays with clear thesis statements, supporting evidence, and compelling conclusions. Use academic but accessible language.",
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
  }, [topic, wordCount]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI Essay Writer"
      subtitle="Generate well-structured essays on any topic with AI-powered writing assistance."
      howToUse={[
        "Enter your essay topic or prompt in the text area below.",
        "Select your desired word count from the options provided.",
        "Click the Generate button and wait for AI to write your essay.",
        "Review the output and click Copy to clipboard when satisfied.",
      ]}
      faq={[
        {
          question: "How long does it take to generate an essay?",
          answer:
            "Generation typically takes a few seconds depending on the word count selected. Longer essays may take slightly more time.",
        },
        {
          question: "Can I use the generated essays for academic work?",
          answer:
            "AI-generated content should be used as a starting point or reference. Always review, edit, and add your own insights before submitting.",
        },
        {
          question: "What essay topics are supported?",
          answer:
            "The tool supports virtually any topic — from science and history to business and creative writing. Be as specific as possible for best results.",
        },
        {
          question: "Is my data stored or shared?",
          answer:
            "No. Your inputs and generated content are processed in real time and are never stored on our servers. Everything runs privately.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Essay Topic / Prompt
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The impact of artificial education on modern learning methods..."
            rows={4}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Word Count
          </label>
          <div className="flex flex-wrap gap-2">
            {["500", "1000", "1500", "2000"].map((count) => (
              <button
                key={count}
                onClick={() => setWordCount(count)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  wordCount === count
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {count} words
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Generating...
            </span>
          ) : (
            "Generate Essay"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated Essay
              </h3>
              <button
                onClick={handleCopy}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
