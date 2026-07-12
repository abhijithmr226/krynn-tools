"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface MatchResult {
  text: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");

  const flagString = useMemo(
    () => Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join(""),
    [flags]
  );

  const { matches, regexError } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], regexError: "" };
    try {
      const regex = new RegExp(pattern, flagString);
      const results: MatchResult[] = [];
      if (flags.g) {
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = regex.exec(testString)) !== null && safety < 5000) {
          results.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1).filter((g) => g !== undefined),
          });
          if (m[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          results.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1).filter((g) => g !== undefined),
          });
        }
      }
      return { matches: results, regexError: "" };
    } catch {
      return { matches: [], regexError: "Invalid regular expression pattern." };
    }
  }, [pattern, flagString, testString, flags.g]);

  const highlightedText = useMemo(() => {
    if (!matches.length || !testString) return null;
    const sorted = [...matches].sort((a, b) => a.index - b.index);
    const parts: Array<{ text: string; highlight: boolean }> = [];
    let lastEnd = 0;

    for (const m of sorted) {
      if (m.index > lastEnd) {
        parts.push({ text: testString.slice(lastEnd, m.index), highlight: false });
      }
      parts.push({ text: m.text, highlight: true });
      lastEnd = m.index + m.text.length;
    }
    if (lastEnd < testString.length) {
      parts.push({ text: testString.slice(lastEnd), highlight: false });
    }

    return parts;
  }, [matches, testString]);

  const toggleFlag = (f: "g" | "i" | "m" | "s") => {
    setFlags((prev) => ({ ...prev, [f]: !prev[f] }));
  };

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      howToUse={howToUse}
      faq={faq}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Regular Expression Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-muted-foreground)] font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. \d+"
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <span className="text-[var(--color-muted-foreground)] font-mono">/{flagString}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {(["g", "i", "m", "s"] as const).map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flags[f]}
                onChange={() => toggleFlag(f)}
                className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-sm font-mono text-[var(--color-foreground)]">
                {f}
                <span className="ml-1 text-[var(--color-muted-foreground)] text-xs">
                  {f === "g" ? "global" : f === "i" ? "insensitive" : f === "m" ? "multiline" : "dotAll"}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the pattern..."
            className="w-full h-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
          />
        </div>

        {regexError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {regexError}
          </div>
        )}

        {pattern && testString && !regexError && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                Matches: {matches.length}
              </span>
            </div>

            {highlightedText && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <p className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2">Highlighted Matches:</p>
                <pre className="font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
                  {highlightedText.map((part, i) =>
                    part.highlight ? (
                      <mark key={i} className="rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-0.5">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </pre>
              </div>
            )}

            {matches.length > 0 && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <p className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3">Match Details:</p>
                <div className="space-y-2">
                  {matches.map((m, i) => (
                    <div key={i} className="flex flex-wrap items-baseline gap-2 text-sm">
                      <span className="font-mono font-semibold text-[var(--color-foreground)]">
                        Match {i + 1}:
                      </span>
                      <code className="rounded bg-[var(--color-muted)] px-2 py-0.5 font-mono text-[var(--color-primary)]">
                        &quot;{m.text}&quot;
                      </code>
                      <span className="text-[var(--color-muted-foreground)]">at index {m.index}</span>
                      {m.groups.length > 0 && (
                        <span className="text-[var(--color-muted-foreground)]">
                          Groups: {m.groups.map((g, gi) => (
                            <code key={gi} className="ml-1 rounded bg-[var(--color-muted)] px-1.5 py-0.5 font-mono text-[var(--color-accent)]">
                              {g}
                            </code>
                          ))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
