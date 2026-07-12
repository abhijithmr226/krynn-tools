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

type Unit = "km/l" | "mpg";

export default function FuelCostCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [distance, setDistance] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [unit, setUnit] = useState<Unit>("km/l");
  const [result, setResult] = useState<{ fuelNeeded: number; totalCost: number } | null>(null);

  const handleCalculate = () => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(fuelPrice);
    if (!d || !e || !p || d <= 0 || e <= 0 || p <= 0) return;

    const fuelNeeded = d / e;
    setResult({
      fuelNeeded: Math.round(fuelNeeded * 100) / 100,
      totalCost: Math.round(fuelNeeded * p * 100) / 100,
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
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Distance ({unit === "km/l" ? "km" : "miles"})
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder={unit === "km/l" ? "e.g. 500" : "e.g. 300"}
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Fuel Efficiency</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                placeholder={unit === "km/l" ? "e.g. 15" : "e.g. 30"}
                min="0"
                step="0.1"
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                {(["km/l", "mpg"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-2.5 text-sm font-medium uppercase transition-colors duration-200 cursor-pointer ${
                      unit === u
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

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Fuel Price ({unit === "km/l" ? "$/liter" : "$/gallon"})
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="e.g. 1.50"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate Fuel Cost
        </button>

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">
                Fuel Needed ({unit === "km/l" ? "liters" : "gallons"})
              </div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-primary)]">
                {result.fuelNeeded.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">Total Fuel Cost</div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                ${result.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
