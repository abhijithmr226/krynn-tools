"use client";

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

export default function DateCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [days, setDays] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    const d = parseInt(days);
    if (!startDate || !d) return;

    const date = new Date(startDate);
    if (operation === "add") {
      date.setDate(date.getDate() + d);
    } else {
      date.setDate(date.getDate() - d);
    }

    setResult(date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Days to {operation === "add" ? "Add" : "Subtract"}</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 30"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="mt-4 flex overflow-hidden rounded-lg border border-[var(--color-border)]">
          {(["add", "subtract"] as const).map((op) => (
            <button
              key={op}
              onClick={() => { setOperation(op); setResult(null); }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                operation === op
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate Date
        </button>

        {result && (
          <div className="mt-6 rounded-lg bg-[var(--color-muted)] p-6 text-center">
            <div className="text-sm text-[var(--color-muted-foreground)]">Result Date</div>
            <div className="mt-2 text-2xl font-bold text-[var(--color-primary)]">{result}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
