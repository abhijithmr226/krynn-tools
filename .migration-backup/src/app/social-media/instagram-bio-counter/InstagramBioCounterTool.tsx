"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type Mode = "bio" | "caption";

const LIMITS: Record<Mode, { max: number; label: string }> = {
  bio: { max: 150, label: "Instagram Bio" },
  caption: { max: 2200, label: "Instagram Caption" },
};

function getProgressColor(count: number, max: number): string {
  const pct = (count / max) * 100;
  if (pct < 80) return "bg-green-500";
  if (pct < 97) return "bg-yellow-500";
  return "bg-red-500";
}

function getProgressColorHex(count: number, max: number): string {
  const pct = (count / max) * 100;
  if (pct < 80) return "#22c55e";
  if (pct < 97) return "#eab308";
  return "#ef4444";
}

export default function InstagramBioCounterTool({ relatedTools, schema }: Props) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("bio");
  const [copied, setCopied] = useState(false);

  const limit = LIMITS[mode];
  const charCount = text.length;
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const lineCount = useMemo(() => (text ? text.split("\n").length : 0), [text]);
  const remaining = Math.max(0, limit.max - charCount);
  const isOver = charCount > limit.max;

  const progressPct = Math.min((charCount / limit.max) * 100, 100);
  const progressColor = getProgressColor(charCount, limit.max);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const handleClear = useCallback(() => setText(""), []);

  return (
    <ToolLayout
      title="Instagram Bio & Caption Character Counter"
      subtitle="Count characters, words, and lines for Instagram bios and captions. Know exactly how much text fits before you post."
      howToUse={[
        "Choose between Bio (150 characters) or Caption (2,200 characters) mode above.",
        "Type or paste your text into the text area.",
        "Watch the character count, word count, and progress bar update in real-time.",
        "Use the remaining characters display to know how much space you have left.",
      ]}
      faq={[
        { question: "What is the Instagram bio character limit?", answer: "Instagram bios are limited to 150 characters. This includes letters, numbers, punctuation, and emojis." },
        { question: "What is the Instagram caption character limit?", answer: "Instagram captions support up to 2,200 characters. After 125 characters, the caption is truncated with a 'more' link." },
        { question: "Do emojis count as one character?", answer: "Yes, each emoji counts as one character in Instagram's limit. Multi-codepoint emojis (like flags) may count differently on the server." },
        { question: "Is my text stored or uploaded?", answer: "No. All processing happens in your browser. Your text is never sent to any server." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1">
          {(Object.keys(LIMITS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              }`}
            >
              {LIMITS[m].label} ({LIMITS[m].max.toLocaleString()})
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === "bio" ? "Type your Instagram bio here..." : "Type your Instagram caption here..."}
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Progress</span>
            <span className={`text-sm font-bold ${isOver ? "text-red-500" : remaining < 10 ? "text-yellow-500" : "text-[var(--color-foreground)]"}`}>
              {remaining} characters remaining
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--color-muted-foreground)]">
            <span>0</span>
            <span>{charCount.toLocaleString()} / {limit.max.toLocaleString()}</span>
            <span>{limit.max.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: getProgressColorHex(charCount, limit.max) }}>{charCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Characters</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{wordCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Words</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{lineCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Lines</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!text}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy Text"}
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
