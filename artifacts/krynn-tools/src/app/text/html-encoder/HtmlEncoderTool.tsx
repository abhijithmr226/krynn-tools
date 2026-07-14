import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function encodeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function decodeHtml(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEncoderTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeHtml(input));
      } else {
        setOutput(decodeHtml(input));
      }
    } catch {
      setError("Failed to process the input. Check for invalid entities.");
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="HTML Encoder Decoder Online Free"
      subtitle="Encode and decode HTML entities online."
      howToUse={[
        "Choose Encode or Decode mode.",
        "Paste your HTML or text into the input area.",
        "Click the process button and copy the result.",
      ]}
      faq={[
        { question: "What are HTML entities?", answer: "HTML entities are special character codes used in HTML to represent reserved characters like <, >, and &. For example, &lt; represents <." },
        { question: "When should I encode HTML?", answer: "Encode HTML when you need to display user input as text rather than HTML. This prevents XSS attacks and ensures proper rendering." },
        { question: "Is my text stored?", answer: "No. All encoding/decoding happens in your browser. Your text never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter HTML entities to decode..."}
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={!input}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            {mode === "encode" ? "Encode HTML" : "Decode HTML"}
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

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Output:
            </label>
            <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
