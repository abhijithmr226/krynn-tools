"use client";

import { useState, useCallback } from "react";
import { format } from "sql-formatter";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const DIALECTS = [
  { label: "Standard SQL", value: "sql" as const },
  { label: "MySQL", value: "mysql" as const },
  { label: "PostgreSQL", value: "postgresql" as const },
  { label: "SQLite", value: "sqlite" as const },
  { label: "SQL Server", value: "tsql" as const },
  { label: "Oracle", value: "oracle" as const },
  { label: "BigQuery", value: "bigquery" as const },
  { label: "Redshift", value: "redshift" as const },
  { label: "Spark", value: "spark" as const },
];

export default function SqlFormatterTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<string>("sql");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    setError("");
    try {
      const formatted = format(input, { language: dialect as any, tabWidth: 2, keywordCase: "upper" });
      setOutput(formatted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to format SQL");
    }
  }, [input, dialect]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = output.split("\n");

  return (
    <ToolLayout
      title="SQL Formatter Online Free"
      subtitle="Format and beautify SQL queries online."
      howToUse={[
        "Paste your SQL query into the input text area below.",
        "Select the SQL dialect that matches your database and click Format.",
        "Copy the formatted output with line numbers to your clipboard.",
      ]}
      faq={[
        { question: "Which SQL dialect should I choose?", answer: "Select the dialect that matches your database system. If unsure, \"Standard SQL\" works for most queries. Different dialects handle specific syntax like string concatenation and limits differently." },
        { question: "Will formatting change my query logic?", answer: "No. The formatter only adds indentation, line breaks, and keyword casing. Your query logic and results remain identical." },
        { question: "Is my SQL query stored on a server?", answer: "No. All formatting is done locally in your browser using the sql-formatter library. Your queries never leave your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY order_count DESC;"
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Dialect:</label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleFormat}
            disabled={!input.trim()}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50"
          >
            Format
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
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-[var(--color-muted-foreground)]/50">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
