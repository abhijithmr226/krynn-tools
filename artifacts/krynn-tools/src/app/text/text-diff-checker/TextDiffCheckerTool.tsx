import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  lineNum: number;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split("\n");
  const modLines = modified.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(origLines.length, modLines.length);
  let origIdx = 0;
  let modIdx = 0;
  let lineNum = 1;

  while (origIdx < origLines.length || modIdx < modLines.length) {
    if (origIdx >= origLines.length) {
      result.push({ type: "added", text: modLines[modIdx], lineNum });
      modIdx++;
    } else if (modIdx >= modLines.length) {
      result.push({ type: "removed", text: origLines[origIdx], lineNum });
      origIdx++;
    } else if (origLines[origIdx] === modLines[modIdx]) {
      result.push({ type: "unchanged", text: origLines[origIdx], lineNum });
      origIdx++;
      modIdx++;
    } else {
      const nextModIdx = modLines.indexOf(origLines[origIdx], modIdx);
      const nextOrigIdx = origLines.indexOf(modLines[modIdx], origIdx);

      if (nextModIdx !== -1 && (nextOrigIdx === -1 || nextModIdx - modIdx <= nextOrigIdx - origIdx)) {
        while (modIdx < nextModIdx) {
          result.push({ type: "added", text: modLines[modIdx], lineNum });
          modIdx++;
          lineNum++;
        }
      } else if (nextOrigIdx !== -1) {
        while (origIdx < nextOrigIdx) {
          result.push({ type: "removed", text: origLines[origIdx], lineNum });
          origIdx++;
          lineNum++;
        }
      } else {
        result.push({ type: "removed", text: origLines[origIdx], lineNum });
        result.push({ type: "added", text: modLines[modIdx], lineNum });
        origIdx++;
        modIdx++;
      }
    }
    lineNum++;
  }

  return result;
}

export default function TextDiffCheckerTool({ relatedTools, schema }: Props) {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const diff = useMemo(() => {
    if (!original && !modified) return [];
    return computeDiff(original, modified);
  }, [original, modified]);

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "added").length;
    const removed = diff.filter((d) => d.type === "removed").length;
    return { added, removed, unchanged: diff.length - added - removed };
  }, [diff]);

  return (
    <ToolLayout
      title="Text Diff Checker Online Free"
      subtitle="Compare two texts and highlight differences side by side."
      howToUse={[
        "Paste the original text into the left textarea.",
        "Paste the modified text into the right textarea.",
        "View the highlighted differences below: green for additions, red for removals.",
      ]}
      faq={[
        { question: "How are differences highlighted?", answer: "Added lines are shown in green, removed lines in red, and unchanged lines in neutral gray." },
        { question: "Is line-by-line comparison used?", answer: "Yes. The tool compares line by line. Lines that don't match are marked as added or removed." },
        { question: "Is my text stored?", answer: "No. All comparison happens in your browser. Your text never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Original Text
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="h-64 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Modified Text
            </label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="h-64 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {diff.length > 0 && (
          <div>
            <div className="mb-3 flex flex-wrap gap-4 text-sm">
              <span className="text-green-600 font-medium">+{stats.added} added</span>
              <span className="text-red-600 font-medium">-{stats.removed} removed</span>
              <span className="text-[var(--color-muted-foreground)]">{stats.unchanged} unchanged</span>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`flex font-mono text-sm border-b border-[var(--color-border)] last:border-b-0 ${
                    line.type === "added"
                      ? "bg-green-50 dark:bg-green-950"
                      : line.type === "removed"
                      ? "bg-red-50 dark:bg-red-950"
                      : ""
                  }`}
                >
                  <span className="w-12 shrink-0 px-2 py-1 text-right text-[var(--color-muted-foreground)] border-r border-[var(--color-border)]">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  <pre className="flex-1 whitespace-pre-wrap px-3 py-1 text-[var(--color-foreground)]">
                    {line.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
