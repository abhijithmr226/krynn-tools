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

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: { days: number; date: string };
}

function calculateAge(dob: Date): AgeResult {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = today.getTime() - dob.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const nextBirthdayDate = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthdayDate <= today) {
    nextBirthdayDate.setFullYear(today.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil(
    (nextBirthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthday: {
      days: daysUntilBirthday,
      date: nextBirthdayDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };
}

export default function AgeCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const handleCalculate = () => {
    if (!dob) return;
    const date = new Date(dob);
    if (isNaN(date.getTime())) return;
    setResult(calculateAge(date));
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
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[220px]">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="btn-primary px-8 py-2.5 font-semibold cursor-pointer"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-6 text-center">
                <div className="text-4xl font-bold text-[var(--color-primary)]">{result.years}</div>
                <div className="mt-1 text-sm text-[var(--color-muted-foreground)]">Years</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-6 text-center">
                <div className="text-4xl font-bold text-[var(--color-accent)]">{result.months}</div>
                <div className="mt-1 text-sm text-[var(--color-muted-foreground)]">Months</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-6 text-center">
                <div className="text-4xl font-bold text-[var(--color-primary)]">{result.days}</div>
                <div className="mt-1 text-sm text-[var(--color-muted-foreground)]">Days</div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                You have lived for approximately{" "}
                <span className="font-semibold text-[var(--color-foreground)]">{result.totalDays.toLocaleString()}</span> days.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--color-accent)] bg-[var(--color-background)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Your next birthday is on{" "}
                <span className="font-semibold text-[var(--color-foreground)]">{result.nextBirthday.date}</span>
                {" "}—{" "}
                <span className="font-semibold text-[var(--color-accent)]">{result.nextBirthday.days} days</span> from now!
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
