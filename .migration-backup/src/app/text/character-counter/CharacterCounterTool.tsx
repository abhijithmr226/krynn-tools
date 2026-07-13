"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
}

function computeStats(text: string): Stats {
  if (!text) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, lines: 0 };
  }
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1;
  const lines = text.split("\n").length;
  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines };
}

export default function CharacterCounterTool({ relatedTools, schema }: Props) {
  const [text, setText] = useState("");
  const stats = useMemo(() => computeStats(text), [text]);

  const handleClear = useCallback(() => setText(""), []);

  const statCards = [
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
  ];

  return (
    <ToolLayout
      title="Character Counter Online Free"
      subtitle="Count characters, words, sentences, and paragraphs with real-time stats."
      howToUse={[
        "Type or paste your text into the text area below.",
        "All stats update instantly as you type.",
        "View character count, word count, sentence count, and more.",
      ]}
      faq={[
        { question: "Does it count spaces?", answer: "Yes. The main character count includes spaces. Use the 'Characters (no spaces)' stat for a count without whitespace." },
        { question: "How are words counted?", answer: "Words are split by whitespace. Multiple spaces between words are treated as a single separator." },
        { question: "Is my text stored?", answer: "No. All processing happens in your browser. Your text is never sent to any server." },
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
          />
        </div>

        {text && (
          <button
            onClick={handleClear}
            className="cursor-pointer text-sm font-medium text-red-500 transition-colors duration-200 hover:underline"
          >
            Clear text
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center transition-colors duration-200"
            >
              <p className="text-2xl font-bold text-[var(--color-primary)]">{card.value}</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
