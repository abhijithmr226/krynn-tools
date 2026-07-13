"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type ReverseMode = "all" | "words" | "lines" | "letters-word";

export default function ReverseTextTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReverseMode>("all");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleReverse = useCallback(() => {
    if (!input) return;

    let res = "";
    if (mode === "all") {
      // Reverse absolutely everything
      res = input.split("").reverse().join("");
    } else if (mode === "words") {
      // Keep word content intact, but reverse order of words
      res = input.split(/\s+/).reverse().join(" ");
    } else if (mode === "lines") {
      // Keep lines intact, but reverse line order
      res = input.split("\n").reverse().join("\n");
    } else if (mode === "letters-word") {
      // Keep word order intact, but reverse letters in each word
      res = input
        .split(" ")
        .map((w) => w.split("").reverse().join(""))
        .join(" ");
    }
    setOutput(res);
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Reverse Text Generator Online Free"
      subtitle="Reverse text, word order, line order, or letters in each word instantly."
      howToUse={[
        "Paste your text into the input field.",
        "Choose a reverse mode (Entire text, Reverse words, Reverse lines, or Reverse letters of each word).",
        "Click the Reverse Text button and copy your output instantly.",
      ]}
      faq={[
        { question: "Are my inputs uploaded?", answer: "No. Reversing is calculated client-side in your browser. Your text never leaves your device." },
        { question: "What does 'Reverse Letters' do?", answer: "It reverses the character order of each individual word but maintains the standard left-to-right word order in your sentences." },
        { question: "Can I reverse list items?", answer: "Yes, select 'Reverse Lines' to flip the order of lists or itemized rows." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        
        {/* Input box */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[180px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Options */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Reversing Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { mode: "all", label: "Entire Text" },
              { mode: "words", label: "Reverse Words" },
              { mode: "lines", label: "Reverse Lines" },
              { mode: "letters-word", label: "Reverse Letters" },
            ].map((item) => (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode as ReverseMode)}
                className={`rounded-lg border-2 px-3 py-2.5 text-center text-xs font-bold cursor-pointer transition-all duration-200 ${
                  mode === item.mode
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleReverse}
            disabled={!input}
            className="btn-primary px-8 py-2.5 font-bold cursor-pointer disabled:opacity-50"
          >
            Reverse Text
          </button>
          {output && (
            <button
              onClick={handleCopy}
              className="btn-secondary px-8 py-2.5 font-bold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Result"}
            </button>
          )}
        </div>

        {/* Output */}
        {output && (
          <div className="animate-fade-up">
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Reversed Output:
            </label>
            <pre className="max-h-96 overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
