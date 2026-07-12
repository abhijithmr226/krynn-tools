"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const styles = ["Engaging", "Inspirational", "Funny", "Professional"];

export default function InstagramCaptionGeneratorTool({
  relatedTools,
  schema,
}: Props) {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("Engaging");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write an ${style.toLowerCase()} Instagram caption for:\n\n${description}\n\nInclude:\n- An engaging opening line\n- The main caption text\n- 10-15 relevant hashtags\n- Contextually relevant emojis\n\nKeep it concise but impactful.`,
          systemInstruction: "You are a social media copywriter. Write engaging Instagram captions that drive engagement, with relevant emojis and trending hashtags. Match the requested style perfectly.",
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
  }, [description, style]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI Instagram Caption Generator"
      subtitle="Generate creative Instagram captions with hashtags and emoji suggestions."
      howToUse={[
        "Describe your photo or content in the text area below.",
        "Choose a caption style that fits your brand.",
        "Click Generate to get your perfect Instagram caption.",
        "Copy the caption and paste it directly into your Instagram post.",
      ]}
      faq={[
        {
          question: "How many hashtags are included?",
          answer:
            "The tool generates 8-15 relevant hashtags based on your content. This is within Instagram's optimal range for engagement.",
        },
        {
          question: "Can I generate captions for different types of posts?",
          answer:
            "Yes. Works for selfies, product photos, travel shots, food pics, motivational posts, and any other Instagram content type.",
        },
        {
          question: "Are emojis included in the captions?",
          answer:
            "Yes. The AI adds contextually relevant emojis to make your captions more visually appealing and engaging.",
        },
        {
          question: "How do I get the best results?",
          answer:
            "Be descriptive about your photo. Mention the mood, setting, colors, or activity for more tailored and creative captions.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Photo / Content Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Sunset beach photo with friends, golden hour lighting, tropical vacation vibes..."
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Caption Style
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
          disabled={!description.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Generating caption...
            </span>
          ) : (
            "Generate Instagram Caption"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated Caption
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
