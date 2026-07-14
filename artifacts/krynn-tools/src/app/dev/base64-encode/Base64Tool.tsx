import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function Base64Tool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setError("");
    try {
      const encoded = btoa(
        new TextEncoder()
          .encode(input)
          .reduce((s, b) => s + String.fromCharCode(b), "")
      );
      setOutput(encoded);
    } catch {
      setError("Failed to encode. Please check your input.");
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      const decoded = new TextDecoder("utf-8").decode(
        Uint8Array.from(atob(input), (c) => c.charCodeAt(0))
      );
      setOutput(decoded);
    } catch {
      setError("Invalid Base64 string. Please check your input.");
    }
  };

  const handleProcess = () => {
    if (mode === "encode") handleEncode();
    else handleDecode();
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              mode === "encode"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              mode === "decode"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
            }`}
          >
            Decode
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
          {mode === "encode" ? "Input Text" : "Base64 String"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
          className="w-full h-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={handleProcess} className="btn-primary px-6 py-2.5 font-semibold cursor-pointer">
            {mode === "encode" ? "Encode" : "Decode"}
          </button>
          {output && (
            <button onClick={handleCopy} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy Result"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </label>
            <pre className="max-h-64 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
