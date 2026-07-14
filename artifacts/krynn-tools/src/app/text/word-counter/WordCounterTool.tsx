import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface WordCounterToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

function computeStats(text: string): Stats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: "0 min",
    };
  }
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1;
  const minutes = Math.ceil(words / 200);
  const readingTime = minutes < 1 ? "Less than 1 min" : `${minutes} min`;

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
}

export default function WordCounterTool({
  relatedTools,
  schema,
}: WordCounterToolProps) {
  const [text, setText] = useState("");

  const stats = useMemo(() => computeStats(text), [text]);

  const handleClear = useCallback(() => setText(""), []);

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: stats.readingTime },
  ];

  return (
    <ToolLayout
      title="Word Counter Online Free"
      subtitle="Count words, characters, sentences, and paragraphs instantly."
      howToUse={[
        "Type or paste your text into the text area below.",
        "Stats update instantly as you type — no button needed.",
        "Read the word count, character count, sentence count, and more.",
      ]}
      faq={[
        {
          question: "How is reading time calculated?",
          answer:
            "Reading time is based on an average speed of 200 words per minute, which is a common adult reading pace.",
        },
        {
          question: "Does it count differently for different languages?",
          answer:
            "The word counter splits text by whitespace, which works well for most languages. Some languages without spaces between words may show different results.",
        },
        {
          question: "Is my text stored or sent anywhere?",
          answer:
            "No. All counting happens in your browser. Your text is never stored or transmitted to any server.",
        },
        {
          question: "What counts as a paragraph?",
          answer:
            "A paragraph is detected by a double line break (blank line between text blocks). A single block of text counts as one paragraph.",
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
            className="min-h-[250px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
            style={{ boxShadow: "none" }}
          />
        </div>

        {text && (
          <button
            onClick={handleClear}
            className="cursor-pointer text-sm font-medium text-[var(--color-destructive)] transition-colors duration-200 hover:underline"
          >
            Clear text
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center"
            >
              <p className="text-2xl font-bold text-[var(--color-primary)]">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
