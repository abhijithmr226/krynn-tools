import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const tones = ["Formal", "Casual", "Professional", "Creative"];

export default function ParagraphWriterTool({ relatedTools, schema }: Props) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Formal");
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
          prompt: `Write a ${tone.toLowerCase()} paragraph about the following topic:\n\n${topic}\n\nMake it well-structured, coherent, and approximately 150-200 words.`,
          systemInstruction: "You are a skilled paragraph writer. Craft well-structured, focused paragraphs that clearly convey the requested topic in the specified tone.",
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
  }, [topic, tone]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI Paragraph Writer"
      subtitle="Generate coherent paragraphs on any subject with the perfect tone."
      howToUse={[
        "Type your topic or prompt in the text area below.",
        "Choose a tone that matches your intended style.",
        "Click Generate and let AI write your paragraph.",
        "Copy the output to your clipboard when ready.",
      ]}
      faq={[
        {
          question: "What tones are available?",
          answer:
            "Four tones are supported: Formal, Casual, Professional, and Creative. Each adjusts the writing style to match your needs.",
        },
        {
          question: "Can I generate multiple paragraphs?",
          answer:
            "Yes. Run the tool multiple times with different prompts or adjust the tone to produce varied paragraph content.",
        },
        {
          question: "How do I get the best results?",
          answer:
            "Be specific in your prompt. Instead of 'dogs', try 'the benefits of owning a therapy dog for elderly patients'.",
        },
        {
          question: "Is the content original?",
          answer:
            "AI generates unique content each time. However, always review for accuracy and uniqueness before publishing.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Topic / Prompt
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The benefits of daily exercise for mental health..."
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
              <span className="spinner" /> Generating...
            </span>
          ) : (
            "Generate Paragraph"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated Paragraph
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
