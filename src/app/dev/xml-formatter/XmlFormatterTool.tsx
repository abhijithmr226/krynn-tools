"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function formatXml(xml: string, indentSize: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const errors = doc.getElementsByTagName("parsererror");
  if (errors.length > 0) {
    throw new Error("Invalid XML: " + errors[0].textContent);
  }

  const indent = " ".repeat(indentSize);
  let formatted = "";
  let level = 0;

  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(doc);

  const tokens = raw.replace(/(>)(<)(?!\/)/g, "$1\n$2").split("\n");

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("<?") || trimmed.startsWith("<!")) {
      formatted += indent.repeat(level) + trimmed + "\n";
    } else if (trimmed.startsWith("</")) {
      level = Math.max(0, level - 1);
      formatted += indent.repeat(level) + trimmed + "\n";
    } else if (trimmed.endsWith("/>")) {
      formatted += indent.repeat(level) + trimmed + "\n";
    } else if (trimmed.startsWith("<")) {
      formatted += indent.repeat(level) + trimmed + "\n";
      level++;
    } else {
      formatted += indent.repeat(level) + trimmed + "\n";
    }
  }

  return formatted.trim();
}

export default function XmlFormatterTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    setError("");
    try {
      setOutput(formatXml(input, indent));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid XML");
    }
  }, [input, indent]);

  const handleMinify = useCallback(() => {
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      const errors = doc.getElementsByTagName("parsererror");
      if (errors.length > 0) throw new Error("Invalid XML");
      const serializer = new XMLSerializer();
      setOutput(serializer.serializeToString(doc).replace(/>\s*</g, "><").trim());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid XML");
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
      title="XML Formatter Online Free"
      subtitle="Format and pretty-print XML documents online."
      howToUse={[
        "Paste your XML data into the text area below.",
        "Choose the indent size and click Format or Minify.",
        "Copy the formatted output to your clipboard.",
      ]}
      faq={[
        { question: "What if my XML is invalid?", answer: "The formatter will display an error message if the XML is malformed. Fix the XML syntax and try again." },
        { question: "What indent size should I use?", answer: "2 spaces is the most common convention, but 4 spaces or tabs are also widely used. Choose what matches your project." },
        { question: "Is my data stored?", answer: "No. All formatting happens in your browser. Your XML data never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<root><item>value</item></root>"
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Indent:</label>
          {([2, 4] as const).map((v) => (
            <button
              key={v}
              onClick={() => setIndent(v)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                indent === v
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {v} Spaces
            </button>
          ))}
          <button
            onClick={handleFormat}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            disabled={!input.trim()}
            className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Minify
          </button>
          {output && (
            <button onClick={handleCopy} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Formatted Output:
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
