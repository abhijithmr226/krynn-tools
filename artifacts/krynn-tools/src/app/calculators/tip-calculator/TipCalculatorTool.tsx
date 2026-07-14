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

export default function TipCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState<{ tipPerPerson: number; totalPerPerson: number; tipTotal: number; billTotal: number } | null>(null);

  const handleCalculate = () => {
    const b = parseFloat(bill);
    if (!b || b <= 0 || people < 1) return;
    const tipTotal = b * (tipPercent / 100);
    const billTotal = b + tipTotal;
    setResult({
      tipPerPerson: Math.round((tipTotal / people) * 100) / 100,
      totalPerPerson: Math.round((billTotal / people) * 100) / 100,
      tipTotal: Math.round(tipTotal * 100) / 100,
      billTotal: Math.round(billTotal * 100) / 100,
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
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Bill Amount ($)</label>
            <input
              type="number"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="e.g. 85.50"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Tip Percentage: <span className="text-[var(--color-primary)]">{tipPercent}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {[10, 15, 18, 20, 25].map((p) => (
                <button
                  key={p}
                  onClick={() => setTipPercent(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    tipPercent === p
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Split Between</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-muted)] text-lg font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-border)] cursor-pointer"
              >
                -
              </button>
              <span className="min-w-[3rem] text-center text-lg font-bold text-[var(--color-foreground)]">{people}</span>
              <button
                onClick={() => setPeople(people + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-muted)] text-lg font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-border)] cursor-pointer"
              >
                +
              </button>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {people === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate Tip
        </button>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">Tip Total</div>
                <div className="mt-1 text-xl font-bold text-[var(--color-primary)]">
                  ${result.tipTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">Bill Total</div>
                <div className="mt-1 text-xl font-bold text-[var(--color-accent)]">
                  ${result.billTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            {people > 1 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[var(--color-border)] p-4 text-center">
                  <div className="text-sm text-[var(--color-muted-foreground)]">Tip Per Person</div>
                  <div className="mt-1 text-xl font-bold text-[var(--color-primary)]">
                    ${result.tipPerPerson.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--color-border)] p-4 text-center">
                  <div className="text-sm text-[var(--color-muted-foreground)]">Total Per Person</div>
                  <div className="mt-1 text-xl font-bold text-[var(--color-accent)]">
                    ${result.totalPerPerson.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
