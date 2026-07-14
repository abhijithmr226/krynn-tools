import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const genres = ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Adventure"];
const lengths = ["Short (300 words)", "Medium (700 words)", "Long (1200 words)"];

export default function StoryGeneratorTool({ relatedTools, schema }: Props) {
  const [genre, setGenre] = useState("Fantasy");
  const [prompt, setPrompt] = useState("");
  const [length, setLength] = useState("Medium (700 words)");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a ${length.toLowerCase()} ${genre} story based on this idea:\n\n${prompt}\n\nInclude vivid descriptions, compelling characters, and an engaging narrative arc.`,
          systemInstruction: "You are a creative fiction writer. Craft engaging, original stories with vivid imagery, well-developed characters, and compelling narratives in the requested genre.",
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
  }, [prompt, genre, length]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI Story Generator"
      subtitle="Create engaging short stories and narratives with AI-powered creativity."
      howToUse={[
        "Select a genre from the options below.",
        "Describe your story idea, characters, or setting in the prompt area.",
        "Choose your preferred story length.",
        "Click Generate and read your AI-crafted story.",
      ]}
      faq={[
        {
          question: "What genres are supported?",
          answer:
            "Six genres are available: Fantasy, Sci-Fi, Mystery, Romance, Horror, and Adventure. Each produces stories with genre-appropriate themes.",
        },
        {
          question: "How detailed should my prompt be?",
          answer:
            "The more detail you provide, the better the story. Include character names, setting descriptions, and plot ideas for richer output.",
        },
        {
          question: "Can I use these stories commercially?",
          answer:
            "AI-generated content can be used as a foundation. We recommend editing and adding your own creative touch before any commercial use.",
        },
        {
          question: "How original are the stories?",
          answer:
            "Each generation is unique and crafted based on your specific prompt. No two runs will produce the same story.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Genre
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  genre === g
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Story Idea / Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A detective discovers that the missing person case leads to a hidden underground city beneath London..."
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Story Length
          </label>
          <div className="flex flex-wrap gap-2">
            {lengths.map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  length === l
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Writing your story...
            </span>
          ) : (
            "Generate Story"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Your Story
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
