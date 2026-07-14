import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface RemoveDuplicatesToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RemoveDuplicatesTool({
  relatedTools,
  schema,
}: RemoveDuplicatesToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [preserveOrder, setPreserveOrder] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [stats, setStats] = useState({ removed: 0, remaining: 0 });

  const handleRemove = useCallback(() => {
    const lines = text.split("\n");
    const processLine = (line: string) =>
      trimWhitespace ? line.trim() : line;

    let uniqueLines: string[];
    if (preserveOrder) {
      const seen = new Set<string>();
      uniqueLines = [];
      for (const line of lines) {
        const key = processLine(line);
        if (!seen.has(key)) {
          seen.add(key);
          uniqueLines.push(line);
        }
      }
    } else {
      const processed = lines.map(processLine);
      const unique = [...new Set(processed)];
      uniqueLines = unique;
    }

    setResult(uniqueLines.join("\n"));
    setStats({
      removed: lines.length - uniqueLines.length,
      remaining: uniqueLines.length,
    });
  }, [text, preserveOrder, trimWhitespace]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deduplicated-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <ToolLayout
      title="Remove Duplicate Lines Online Free"
      subtitle="Remove duplicate lines from text instantly."
      howToUse={[
        "Paste or type your text into the input area below.",
        "Choose whether to preserve original order and trim whitespace.",
        "Click Remove Duplicates and get your cleaned text instantly.",
      ]}
      faq={[
        {
          question: "What does 'preserve order' mean?",
          answer:
            "When enabled, the original order of lines is kept and only the first occurrence of each duplicate is retained. When disabled, the output is sorted.",
        },
        {
          question: "What does 'trim whitespace' do?",
          answer:
            "When enabled, leading and trailing spaces are removed before comparing lines. Two lines that differ only in whitespace will be treated as duplicates.",
        },
        {
          question: "Is my text stored anywhere?",
          answer:
            "No. All processing happens in your browser. Your text is never sent to or stored on any server.",
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
            placeholder="Paste your text with duplicate lines here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
            style={{ boxShadow: "none" }}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-foreground)]">
            <input
              type="checkbox"
              checked={preserveOrder}
              onChange={(e) => setPreserveOrder(e.target.checked)}
              className="accent-[var(--color-primary)]"
            />
            Preserve order
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-foreground)]">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="accent-[var(--color-primary)]"
            />
            Trim whitespace
          </label>
        </div>

        {text && !result && (
          <button onClick={handleRemove} className="btn-primary w-full">
            Remove Duplicates
          </button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  <span className="font-bold text-[var(--color-accent)]">{stats.removed}</span>{" "}
                  duplicate lines removed —{" "}
                  <span className="font-bold text-[var(--color-foreground)]">
                    {stats.remaining}
                  </span>{" "}
                  unique lines remaining
                </p>
              </div>
              <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded-md bg-[var(--color-muted)] p-4 text-sm text-[var(--color-foreground)]">
                {result}
              </pre>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCopy} className="btn-primary flex-1">
                Copy Result
              </button>
              <button onClick={handleDownload} className="btn-secondary flex-1">
                Download
              </button>
            </div>
            <button
              onClick={() => {
                setResult("");
                setStats({ removed: 0, remaining: 0 });
              }}
              className="btn-secondary w-full"
            >
              Process Another Text
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
