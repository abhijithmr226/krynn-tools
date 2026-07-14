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

type Mode = "x-of-y" | "percent-of" | "change";

export default function PercentageCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [mode, setMode] = useState<Mode>("x-of-y");
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const modes: { value: Mode; label: string; desc: string }[] = [
    { value: "x-of-y", label: "X is what % of Y", desc: "Find what percentage X is of Y" },
    { value: "percent-of", label: "What is X% of Y", desc: "Find X percent of a number" },
    { value: "change", label: "Percentage Change", desc: "Change from X to Y" },
  ];

  const handleCalculate = () => {
    setError("");
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);

    if (isNaN(a) || isNaN(b)) {
      setError("Please enter valid numbers in both fields.");
      setResult(null);
      return;
    }

    if (mode === "x-of-y") {
      if (b === 0) {
        setError("Y cannot be zero.");
        setResult(null);
        return;
      }
      setResult(((a / b) * 100).toFixed(4).replace(/\.?0+$/, "") + "%");
    } else if (mode === "percent-of") {
      setResult((a / 100 * b).toFixed(4).replace(/\.?0+$/, ""));
    } else {
      if (a === 0) {
        setError("Initial value cannot be zero.");
        setResult(null);
        return;
      }
      const change = ((b - a) / Math.abs(a)) * 100;
      const sign = change >= 0 ? "+" : "";
      setResult(sign + change.toFixed(4).replace(/\.?0+$/, "") + "%");
    }
  };

  const getLabels = () => {
    switch (mode) {
      case "x-of-y":
        return { a: "X", b: "Y" };
      case "percent-of":
        return { a: "Percentage", b: "Number" };
      case "change":
        return { a: "From (X)", b: "To (Y)" };
    }
  };

  const labels = getLabels();

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
        <div className="flex flex-wrap gap-3">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => { setMode(m.value); setResult(null); setError(""); setInputA(""); setInputB(""); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                mode === m.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-[var(--color-muted-foreground)]">
          {modes.find((m) => m.value === mode)?.desc}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              {labels.a}
            </label>
            <input
              type="number"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              placeholder="Enter value"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              {labels.b}
            </label>
            <input
              type="number"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              placeholder="Enter value"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full py-2.5 font-semibold cursor-pointer">
          Calculate
        </button>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {result !== null && (
          <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-6 text-center">
            <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Result</p>
            <p className="text-3xl font-bold text-[var(--color-accent)]">{result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
