import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function LineNumberGeneratorTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [startAt, setStartAt] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const lines = input.split("\n");
    const numbered = lines
      .map((line, i) => `${String(i + startAt).padStart(4, " ")} | ${line}`)
      .join("\n");
    setOutput(numbered);
  }, [input, startAt]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Line Number Generator Online Free"
      subtitle="Add line numbers to any text instantly. Free online tool."
      howToUse={[
        "Paste your text or code into the input area.",
        "Choose the starting line number (default is 1).",
        "Click Generate to add line numbers, then copy the result.",
      ]}
      faq={[
        { question: "Can I start numbering from a specific line?", answer: "Yes. Set the 'Start at' value to any number. This is useful when numbering specific sections of larger files." },
        { question: "What format is used?", answer: "Lines are numbered in the format: '    1 | line content'. The number is right-aligned in a 4-digit field followed by a pipe separator." },
        { question: "Is my text stored?", answer: "No. All processing happens in your browser. Your text never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text or code here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Start at:</label>
          <input
            type="number"
            value={startAt}
            onChange={(e) => setStartAt(Math.max(0, Number(e.target.value)))}
            className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            onClick={handleGenerate}
            disabled={!input}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Generate Line Numbers
          </button>
          {output && (
            <button
              onClick={handleCopy}
              className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Numbered Output:
            </label>
            <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)]">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
