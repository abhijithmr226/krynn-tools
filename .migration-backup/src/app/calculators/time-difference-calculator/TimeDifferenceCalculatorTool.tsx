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

interface DiffResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

function calculateDiff(start: string, end: string): DiffResult | null {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
  if (endDate <= startDate) return null;

  const diffMs = endDate.getTime() - startDate.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(diffMs / 3600000);
  const totalDays = Math.floor(diffMs / 86400000);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const hours = Math.floor((totalMinutes % 1440) / 60);
  const mins = totalMinutes % 60;

  return { years, months, days, hours, minutes: mins, totalDays, totalHours, totalMinutes };
}

export default function TimeDifferenceCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const result = calculateDiff(start, end);

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
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Start Date & Time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">End Date & Time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {[
                { label: "Years", value: result.years },
                { label: "Months", value: result.months },
                { label: "Days", value: result.days },
                { label: "Hours", value: result.hours },
                { label: "Minutes", value: result.minutes },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-[var(--color-muted)] p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{item.value}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-lg font-bold text-[var(--color-foreground)]">{result.totalDays.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Total Days</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-lg font-bold text-[var(--color-foreground)]">{result.totalHours.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Total Hours</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-lg font-bold text-[var(--color-foreground)]">{result.totalMinutes.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Total Minutes</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            Select both dates to see the difference
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
