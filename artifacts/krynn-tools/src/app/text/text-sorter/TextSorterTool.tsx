import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface TextSorterToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type SortMode = "az" | "za" | "length-asc" | "length-desc" | "reverse";

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
  { label: "By Length ↑", value: "length-asc" },
  { label: "By Length ↓", value: "length-desc" },
  { label: "Reverse Order", value: "reverse" },
];

export default function TextSorterTool({
  relatedTools,
  schema,
}: TextSorterToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [activeMode, setActiveMode] = useState<SortMode | null>(null);

  const sort = useCallback(
    (mode: SortMode) => {
      const lines = text.split("\n");
      let sorted: string[];

      switch (mode) {
        case "az":
          sorted = [...lines].sort((a, b) => a.localeCompare(b));
          break;
        case "za":
          sorted = [...lines].sort((a, b) => b.localeCompare(a));
          break;
        case "length-asc":
          sorted = [...lines].sort((a, b) => a.length - b.length);
          break;
        case "length-desc":
          sorted = [...lines].sort((a, b) => b.length - a.length);
          break;
        case "reverse":
          sorted = [...lines].reverse();
          break;
        default:
          sorted = lines;
      }

      setResult(sorted.join("\n"));
      setActiveMode(mode);
    },
    [text]
  );

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
    a.download = "sorted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <ToolLayout
      title="Text Sorter Online Free"
      subtitle="Sort lines of text alphabetically or numerically."
      howToUse={[
        "Paste or type your text into the input area below.",
        "Click a sort option button to instantly sort your lines.",
        "Copy or download the sorted result.",
      ]}
      faq={[
        {
          question: "What does 'By Length' sort do?",
          answer:
            "It sorts lines by their character count — shortest first (↑) or longest first (↓). Useful for organizing lists by length.",
        },
        {
          question: "What does 'Reverse Order' do?",
          answer:
            "Reverse Order flips the lines to the opposite of their current order without applying any alphabetical or length-based sorting.",
        },
        {
          question: "Is my text stored anywhere?",
          answer:
            "No. All sorting happens in your browser. Your text is never sent to a server.",
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
            placeholder="Paste your text here, one line per item to sort..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
            style={{ boxShadow: "none" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => sort(opt.value)}
              disabled={!text}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeMode === opt.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-[var(--color-muted-foreground)]">
                Sorted Result
              </p>
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
                setActiveMode(null);
              }}
              className="btn-secondary w-full"
            >
              Sort Another Text
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
