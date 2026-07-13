"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Food & Beverage",
  "Fashion",
  "Real Estate",
  "Fitness & Wellness",
  "E-commerce",
  "Marketing",
];
const styles = ["Modern", "Classic", "Creative", "Professional"];

export default function BusinessNameGeneratorTool({
  relatedTools,
  schema,
}: Props) {
  const [industry, setIndustry] = useState("Technology");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState("Modern");
  const [output, setOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate 10 creative ${style.toLowerCase()} business name ideas for a ${industry} company.\n\nKeywords to incorporate: ${keywords}\n\nReturn ONLY the business names, one per line. No explanations, no numbering, no bullets.`,
          systemInstruction: "You are a creative brand naming expert. Generate memorable, unique, and meaningful business names that are catchy, easy to pronounce, and relevant to the industry and keywords provided.",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.text.split("\n").filter((line: string) => line.trim()));
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keywords, industry, style]);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(output.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleCopyOne = useCallback((name: string) => {
    navigator.clipboard.writeText(name);
  }, []);

  return (
    <ToolLayout
      title="AI Business Name Generator"
      subtitle="Generate creative and memorable business name ideas for your startup."
      howToUse={[
        "Select your industry from the dropdown options.",
        "Enter keywords that describe your business or product.",
        "Choose a naming style that fits your brand vision.",
        "Click Generate to get 10 unique business name suggestions.",
      ]}
      faq={[
        {
          question: "How many names does it generate?",
          answer:
            "The tool generates 10 unique business name suggestions each time you click generate. Run it again for more variations.",
        },
        {
          question: "Should I check if a name is already taken?",
          answer:
            "Yes. Always verify domain availability and trademark status before committing to a business name.",
        },
        {
          question: "What keywords should I use?",
          answer:
            "Use words that describe your product, values, or target market. For example: 'fast delivery', 'organic', 'premium', or 'sustainable'.",
        },
        {
          question: "Can I combine multiple styles?",
          answer:
            "Select one style per generation for best results. Generate with different styles and mix the ones you like.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Industry
          </label>
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  industry === ind
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Keywords
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. fast, reliable, cloud, automation, innovative..."
            rows={2}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Naming Style
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  style === s
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!keywords.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Generating names...
            </span>
          ) : (
            "Generate Business Names"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output.length > 0 && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated Names
              </h3>
              <button
                onClick={handleCopyAll}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                {copied ? "Copied!" : "Copy all"}
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {output.map((name, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyOne(name)}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
                >
                  <span>{name}</span>
                  <svg
                    className="h-4 w-4 text-[var(--color-muted-foreground)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
