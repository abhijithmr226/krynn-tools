import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Toronto",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Singapore",
  "Australia/Sydney",
  "Australia/Perth",
  "Pacific/Auckland",
  "Pacific/Honolulu",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Johannesburg",
];

function formatInTimezone(date: Date, tz: string): string {
  return date.toLocaleString("en-US", {
    timeZone: tz,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getOffset(date: Date, tz: string): string {
  const str = date.toLocaleString("en-US", { timeZone: tz, timeZoneName: "shortOffset" });
  const match = str.match(/GMT([+-]\d{1,2}(?::\d{2})?)/);
  return match ? `UTC${match[1]}` : "UTC+0";
}

function tzLabel(tz: string): string {
  return tz.replace(/_/g, " ").split("/").pop()!;
}

export default function TimeZoneConverterTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const now = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  }, []);

  const [datetime, setDatetime] = useState(now);
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");

  const result = useMemo(() => {
    if (!datetime) return null;
    const inputDate = new Date(datetime);
    if (isNaN(inputDate.getTime())) return null;

    const fromOffsetStr = getOffset(inputDate, fromTz);
    const fromOffsetMatch = fromOffsetStr.match(/([+-])(\d{1,2})(?::(\d{2}))?/);
    let fromOffsetMinutes = 0;
    if (fromOffsetMatch) {
      const sign = fromOffsetMatch[1] === "+" ? 1 : -1;
      fromOffsetMinutes = sign * (parseInt(fromOffsetMatch[2]) * 60 + parseInt(fromOffsetMatch[3] || "0"));
    }

    const utcDate = new Date(inputDate.getTime() - fromOffsetMinutes * 60000);

    const toOffsetStr = getOffset(inputDate, toTz);
    const toOffsetMatch = toOffsetStr.match(/([+-])(\d{1,2})(?::(\d{2}))?/);
    let toOffsetMinutes = 0;
    if (toOffsetMatch) {
      const sign = toOffsetMatch[1] === "+" ? 1 : -1;
      toOffsetMinutes = sign * (parseInt(toOffsetMatch[2]) * 60 + parseInt(toOffsetMatch[3] || "0"));
    }

    const convertedDate = new Date(utcDate.getTime() + toOffsetMinutes * 60000);

    return {
      fromFormatted: formatInTimezone(inputDate, fromTz),
      toFormatted: formatInTimezone(convertedDate, toTz),
      fromOffset: fromOffsetStr,
      toOffset: toOffsetStr,
    };
  }, [datetime, fromTz, toTz]);

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
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Date & Time</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">From Timezone</label>
              <select
                value={fromTz}
                onChange={(e) => setFromTz(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tzLabel(tz)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">To Timezone</label>
              <select
                value={toTz}
                onChange={(e) => setToTz(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tzLabel(tz)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="rounded-lg bg-[var(--color-muted)] p-4">
              <div className="text-sm text-[var(--color-muted-foreground)]">
                {tzLabel(fromTz)} ({result.fromOffset})
              </div>
              <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{result.fromFormatted}</div>
            </div>

            <div className="flex justify-center">
              <svg className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="rounded-lg bg-[var(--color-muted)] p-4">
              <div className="text-sm text-[var(--color-muted-foreground)]">
                {tzLabel(toTz)} ({result.toOffset})
              </div>
              <div className="mt-1 text-lg font-bold text-[var(--color-primary)]">{result.toFormatted}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
