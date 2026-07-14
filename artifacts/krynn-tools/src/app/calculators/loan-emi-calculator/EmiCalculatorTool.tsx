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

type TenureUnit = "months" | "years";

interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EmiCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [result, setResult] = useState<{
    emi: number;
    totalPayment: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const tenureValue = parseFloat(tenure);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureValue) ||
        principal <= 0 || annualRate <= 0 || tenureValue <= 0) {
      setError("Please enter valid positive numbers for all fields.");
      setResult(null);
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureUnit === "years" ? tenureValue * 12 : tenureValue;

    const emi = principal *
      monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;

    const amortization: AmortizationRow[] = [];
    let balance = principal;
    const monthsToShow = Math.min(12, totalMonths);

    for (let m = 1; m <= monthsToShow; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      amortization.push({
        month: m,
        principal: principalPart,
        interest: interestPart,
        balance: balance,
      });
    }

    setResult({ emi, totalPayment, totalInterest, amortization });
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      howToUse={howToUse}
      faq={faq}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Loan Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000000"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 8.5"
              step="0.1"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Loan Tenure
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder={tenureUnit === "years" ? "e.g. 20" : "e.g. 240"}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                {(["years", "months"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setTenureUnit(u)}
                    className={`px-3 py-2.5 text-xs font-medium capitalize transition-colors duration-200 cursor-pointer ${
                      tenureUnit === u
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full py-2.5 font-semibold cursor-pointer">
          Calculate EMI
        </button>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-center">
                <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Monthly EMI</p>
                <p className="text-xl font-bold text-[var(--color-primary)]">
                  {formatCurrency(result.emi)}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-center">
                <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Total Interest</p>
                <p className="text-xl font-bold text-[var(--color-accent)]">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-center">
                <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Total Payment</p>
                <p className="text-xl font-bold text-[var(--color-foreground)]">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
                First Year Amortization
              </h3>
              <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-muted)]">
                      <th className="px-4 py-2.5 text-left font-medium text-[var(--color-foreground)]">Month</th>
                      <th className="px-4 py-2.5 text-right font-medium text-[var(--color-foreground)]">Principal</th>
                      <th className="px-4 py-2.5 text-right font-medium text-[var(--color-foreground)]">Interest</th>
                      <th className="px-4 py-2.5 text-right font-medium text-[var(--color-foreground)]">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.amortization.map((row) => (
                      <tr key={row.month} className="border-t border-[var(--color-border)]">
                        <td className="px-4 py-2 text-[var(--color-foreground)]">{row.month}</td>
                        <td className="px-4 py-2 text-right font-mono text-[var(--color-accent)]">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-[var(--color-primary)]">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-[var(--color-muted-foreground)]">
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
