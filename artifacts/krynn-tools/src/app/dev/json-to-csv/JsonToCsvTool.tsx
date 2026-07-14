import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function jsonToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? "";
          const str = typeof val === "string" ? val : JSON.stringify(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    ),
  ];
  return csvRows.join("\n");
}

export default function JsonToCsvTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const csv = jsonToCsv(arr);
      setOutput(csv);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON input");
    }
  }, [input]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="JSON to CSV Converter Online Free"
      subtitle="Convert JSON arrays to CSV format instantly."
      howToUse={[
        "Paste your JSON array into the input area.",
        "Click Convert to transform it into CSV format.",
        "Copy the output or download it as a CSV file.",
      ]}
      faq={[
        { question: "What JSON format is accepted?", answer: "The input should be a JSON array of objects. Each object becomes a row, and its keys become column headers." },
        { question: "What if my JSON has nested objects?", answer: "Nested objects will be stringified as JSON in the CSV cell. For flat CSV output, flatten your data first." },
        { question: "Is my data stored?", answer: "No. All conversion happens in your browser. Your data never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Convert to CSV
          </button>
          {output && (
            <>
              <button onClick={handleCopy} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
                {copied ? "Copied!" : "Copy CSV"}
              </button>
              <button onClick={handleDownload} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
                Download CSV
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              CSV Output:
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
