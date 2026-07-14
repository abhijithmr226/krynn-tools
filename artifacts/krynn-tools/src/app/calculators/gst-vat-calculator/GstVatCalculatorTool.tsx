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

const rates = [5, 10, 12, 15, 18, 20, 25];

export default function GstVatCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [customRate, setCustomRate] = useState("");
  const [mode, setMode] = useState<"add" | "reverse">("add");
  const [result, setResult] = useState<{ tax: number; total: number } | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(amount);
    const r = customRate ? parseFloat(customRate) : rate;
    if (!a || a <= 0 || !r || r < 0) return;

    if (mode === "add") {
      const tax = a * (r / 100);
      setResult({ tax: Math.round(tax * 100) / 100, total: Math.round((a + tax) * 100) / 100 });
    } else {
      const base = a / (1 + r / 100);
      const tax = a - base;
      setResult({ tax: Math.round(tax * 100) / 100, total: Math.round(base * 100) / 100 });
    }
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
        <div className="mb-4 flex overflow-hidden rounded-lg border border-[var(--color-border)]">
          {(["add", "reverse"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
              }`}
            >
              {m === "add" ? "Add GST/VAT" : "Reverse GST/VAT"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              {mode === "add" ? "Amount (Before Tax)" : "Amount (Including Tax)"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">GST/VAT Rate (%)</label>
            <div className="flex gap-2">
              <select
                value={customRate ? "custom" : rate}
                onChange={(e) => {
                  if (e.target.value === "custom") { setCustomRate(""); }
                  else { setRate(Number(e.target.value)); setCustomRate(""); }
                }}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {rates.map((r) => (
                  <option key={r} value={r}>{r}%</option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>
            {customRate !== "" && (
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder="Custom rate"
                min="0"
                className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            )}
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate
        </button>

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">Tax Amount</div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-primary)]">
                ${result.tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">
                {mode === "add" ? "Total (With Tax)" : "Base Price (Without Tax)"}
              </div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                ${result.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
