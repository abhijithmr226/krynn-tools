"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const tones = ["Informative", "Conversational", "Persuasive", "Technical"];
const wordCounts = ["500", "1000", "1500", "2000"];

export default function BlogGeneratorTool({ relatedTools, schema }: Props) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Informative");
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
      await new Promise((r) => setTimeout(r, 2000));
      setOutput(
        `AI-generated ${tone.toLowerCase()} blog post on "${topic}" (${wordCount} words) will appear here once the API is connected. This placeholder demonstrates the tool's layout and copy functionality.`
      );
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, tone, wordCount]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI Blog Generator"
      subtitle="Generate complete blog posts on any topic with proper structure and SEO-friendly content."
      howToUse={[
        "Enter your blog topic or keyword in the text area.",
        "Select a writing tone that suits your audience.",
        "Choose your desired word count for the blog post.",
        "Click Generate and review your ready-to-publish blog content.",
      ]}
      faq={[
        {
          question: "Are the blog posts SEO-optimized?",
          answer:
            "Yes. The AI generates content with natural keyword integration, proper headings, and structured paragraphs that search engines favor.",
        },
        {
          question: "Can I customize the output further?",
          answer:
            "Absolutely. Use the generated content as a draft and edit it to match your brand voice, add images, or adjust formatting.",
        },
        {
          question: "What topics work best?",
          answer:
            "The tool works with any topic. Be specific — 'how to start a sustainable garden in urban areas' will produce better results than just 'gardening'.",
        },
        {
          question: "Is the content plagiarism-free?",
          answer:
            "AI generates unique content each time. We recommend running a plagiarism check before publishing for complete peace of mind.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Blog Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 10 proven strategies for remote team productivity in 2026..."
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tone === t
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Word Count
          </label>
          <div className="flex flex-wrap gap-2">
            {wordCounts.map((count) => (
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
              <span className="spinner" /> Writing blog post...
            </span>
          ) : (
            "Generate Blog Post"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated Blog Post
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
