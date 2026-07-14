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

export default function JsonFormatterTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<2 | 4 | "tab">(4);
  const [copied, setCopied] = useState(false);

  const getIndentString = () => (indent === "tab" ? "\t" : " ".repeat(indent));

  const handleFormat = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, getIndentString()));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleMinify = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
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
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">
            Indent Size:
          </label>
          {([2, 4, "tab"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setIndent(v)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                indent === v
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {v === "tab" ? "Tab" : `${v} Spaces`}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here... e.g. {"name":"John","age":30}'
          className="w-full h-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleFormat}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer"
          >
            Format / Prettify
          </button>
          <button
            onClick={handleMinify}
            className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer"
          >
            Minify
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
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Output:
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
