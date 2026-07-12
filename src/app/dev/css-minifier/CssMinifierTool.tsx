"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s*>\s*/g, ">")
    .replace(/\s*~\s*/g, "~")
    .replace(/\s*\+\s*/g, "+")
    .replace(/\s*,\s*/g, ",")
    .trim();
}

export default function CssMinifierTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleMinify = useCallback(() => {
    setOutput(minifyCss(input));
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const savedPercent = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;

  return (
    <ToolLayout
      title="CSS Minifier Online Free"
      subtitle="Minify CSS code to reduce file size."
      howToUse={[
        "Paste your CSS code into the input area.",
        "Click Minify to compress the CSS.",
        "Compare the size reduction and copy the minified output.",
      ]}
      faq={[
        { question: "What does CSS minification do?", answer: "Minification removes comments, whitespace, and unnecessary characters from CSS to reduce file size without affecting functionality." },
        { question: "Is minified CSS safe to use?", answer: "Yes. Minification only removes whitespace and comments. It does not change the CSS behavior or selectors." },
        { question: "How much can CSS be reduced?", answer: "Typically 20-40% depending on how much whitespace and comments are in the original CSS." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS code here..."
            className="min-h-[250px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleMinify}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Minify CSS
          </button>
          {output && (
            <button onClick={handleCopy} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {output && (
          <>
            <div className="flex flex-wrap gap-4 rounded-lg bg-[var(--color-muted)] p-4 text-sm">
              <span className="text-[var(--color-foreground)]">
                Original: <strong>{originalSize.toLocaleString()} bytes</strong>
              </span>
              <span className="text-[var(--color-foreground)]">
                Minified: <strong>{minifiedSize.toLocaleString()} bytes</strong>
              </span>
              <span className="font-semibold text-green-600">
                Saved: {savedPercent}% ({(originalSize - minifiedSize).toLocaleString()} bytes)
              </span>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Minified CSS:
              </label>
              <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)]">
                {output}
              </pre>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
