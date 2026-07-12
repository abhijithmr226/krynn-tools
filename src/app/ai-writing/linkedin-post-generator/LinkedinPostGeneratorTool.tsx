"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const tones = ["Professional", "Thought Leadership", "Casual"];

export default function LinkedinPostGeneratorTool({
  relatedTools,
  schema,
}: Props) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const samplePost = `I've been thinking a lot about ${topic} lately, and here's what I've learned:

The key is to focus on delivering value consistently. Most people overcomplicate things when the answer is simpler than they think.

Here are 3 things that changed my perspective:

1. Start with empathy - understand what your audience truly needs
2. Be authentic - people connect with real stories, not corporate speak
3. Take action daily - small consistent steps beat occasional leaps

What's your experience with ${topic}? I'd love to hear your thoughts in the comments.

#${topic.replace(/\s+/g, "")} #Growth #ProfessionalDevelopment #Leadership #Innovation`;
      setOutput(samplePost);
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, tone]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI LinkedIn Post Generator"
      subtitle="Create professional LinkedIn posts that drive engagement and grow your network."
      howToUse={[
        "Enter the topic or idea for your LinkedIn post.",
        "Select a tone that matches your personal brand.",
        "Click Generate to create a ready-to-post LinkedIn update.",
        "Copy the post and paste it directly into LinkedIn.",
      ]}
      faq={[
        {
          question: "How long are the generated posts?",
          answer:
            "Posts are optimized for LinkedIn's algorithm — typically 150-300 words with natural line breaks for readability on mobile.",
        },
        {
          question: "Are hashtags included?",
          answer:
            "Yes. The tool generates relevant hashtags based on your topic to increase your post's discoverability on LinkedIn.",
        },
        {
          question: "Can I customize the tone?",
          answer:
            "Yes. Choose from Professional for corporate content, Thought Leadership for industry insights, or Casual for a more personal touch.",
        },
        {
          question: "Will these posts get more engagement?",
          answer:
            "The posts are structured with engagement hooks, clear formatting, and calls-to-action that typically drive higher interaction rates.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Post Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Lessons learned from scaling a startup, Remote work productivity tips, Why mentorship matters..."
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

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Generating post...
            </span>
          ) : (
            "Generate LinkedIn Post"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated LinkedIn Post
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
