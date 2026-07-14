import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function decodeHtml(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlDecoderTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleDecode = useCallback(() => {
    setError("");
    try {
      setOutput(decodeHtml(input));
    } catch {
      setError("Failed to decode. Check for invalid HTML entities.");
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="HTML Decoder Online Free"
      subtitle="Decode HTML entities back to readable text instantly."
      howToUse={[
        "Paste your encoded HTML entities into the input area.",
        "Click Decode to convert them back to readable text.",
        "Copy the decoded output to your clipboard.",
      ]}
      faq={[
        { question: "What HTML entities can be decoded?", answer: "The decoder handles all standard HTML entities including named entities like &amp;, &lt;, &gt;, &quot;, and numeric entities like &#65; or &#x41;." },
        { question: "What is the difference between this and the encoder?", answer: "This tool focuses solely on decoding HTML entities. For encoding, use our HTML Encoder tool instead." },
        { question: "Is my text stored?", answer: "No. All decoding happens in your browser. Your text never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste encoded HTML entities here..."
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecode}
            disabled={!input}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Decode HTML
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
              Decoded Output:
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
