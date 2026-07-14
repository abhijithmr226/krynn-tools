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

const currencies = [
  { code: "USD", name: "US Dollar", rate: 1 },
  { code: "EUR", name: "Euro", rate: 0.92 },
  { code: "GBP", name: "British Pound", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", rate: 149.5 },
  { code: "INR", name: "Indian Rupee", rate: 83.12 },
  { code: "CAD", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", name: "Australian Dollar", rate: 1.53 },
  { code: "CHF", name: "Swiss Franc", rate: 0.88 },
  { code: "CNY", name: "Chinese Yuan", rate: 7.24 },
  { code: "MXN", name: "Mexican Peso", rate: 17.15 },
  { code: "BRL", name: "Brazilian Real", rate: 4.97 },
  { code: "KRW", name: "South Korean Won", rate: 1328.5 },
  { code: "SGD", name: "Singapore Dollar", rate: 1.34 },
  { code: "SEK", name: "Swedish Krona", rate: 10.42 },
  { code: "ZAR", name: "South African Rand", rate: 18.63 },
];

export default function CurrencyConverterTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const fromCurrency = useMemo(() => currencies.find((c) => c.code === from)!, [from]);
  const toCurrency = useMemo(() => currencies.find((c) => c.code === to)!, [to]);

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (!a || a <= 0) return null;
    const inUsd = a / fromCurrency.rate;
    const converted = inUsd * toCurrency.rate;
    return Math.round(converted * 100) / 100;
  }, [amount, fromCurrency, toCurrency]);

  const swap = () => {
    setFrom(to);
    setTo(from);
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
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-border)] cursor-pointer"
              aria-label="Swap currencies"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="mt-6 rounded-lg bg-[var(--color-muted)] p-6 text-center">
            <div className="text-sm text-[var(--color-muted-foreground)]">Converted Amount</div>
            <div className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
              {result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
            </div>
            <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              1 {from} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {to}
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-center text-[var(--color-muted-foreground)]">
          Rates are approximate and for informational purposes only. Not for financial decisions.
        </p>
      </div>
    </ToolLayout>
  );
}
