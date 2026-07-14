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

const frequencies = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

interface YearData {
  year: number;
  balance: number;
  interest: number;
}

export default function CompoundInterestCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState(12);
  const [result, setResult] = useState<{
    total: number;
    interest: number;
    breakdown: YearData[];
  } | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseInt(time);
    const n = frequency;

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) return;

    const breakdown: YearData[] = [];
    let balance = P;

    for (let year = 1; year <= t; year++) {
      const startBalance = balance;
      balance = P * Math.pow(1 + r / n, n * year);
      breakdown.push({
        year,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round((balance - startBalance) * 100) / 100,
      });
    }

    setResult({
      total: Math.round(balance * 100) / 100,
      interest: Math.round((balance - P) * 100) / 100,
      breakdown,
    });
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
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Principal Amount ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 10000"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 7"
              min="0"
              step="0.1"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Time Period (Years)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Compounding Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {frequencies.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">Total Amount</div>
                <div className="mt-1 text-2xl font-bold text-[var(--color-primary)]">
                  ${result.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">Interest Earned</div>
                <div className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                  ${result.interest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-4 py-2 text-left font-medium text-[var(--color-muted-foreground)]">Year</th>
                    <th className="px-4 py-2 text-right font-medium text-[var(--color-muted-foreground)]">Interest</th>
                    <th className="px-4 py-2 text-right font-medium text-[var(--color-muted-foreground)]">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row) => (
                    <tr key={row.year} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-4 py-2 text-[var(--color-foreground)]">{row.year}</td>
                      <td className="px-4 py-2 text-right text-[var(--color-accent)]">
                        +${row.interest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-[var(--color-foreground)]">
                        ${row.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
