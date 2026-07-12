"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type Category = "length" | "weight" | "temperature" | "volume" | "speed" | "data";

interface UnitDef {
  name: string;
  factor: number;
}

const unitDefs: Record<Category, UnitDef[]> = {
  length: [
    { name: "Meter", factor: 1 },
    { name: "Kilometer", factor: 1000 },
    { name: "Centimeter", factor: 0.01 },
    { name: "Millimeter", factor: 0.001 },
    { name: "Mile", factor: 1609.344 },
    { name: "Yard", factor: 0.9144 },
    { name: "Foot", factor: 0.3048 },
    { name: "Inch", factor: 0.0254 },
  ],
  weight: [
    { name: "Kilogram", factor: 1 },
    { name: "Gram", factor: 0.001 },
    { name: "Milligram", factor: 0.000001 },
    { name: "Pound", factor: 0.453592 },
    { name: "Ounce", factor: 0.0283495 },
    { name: "Tonne", factor: 1000 },
  ],
  temperature: [
    { name: "Celsius", factor: 0 },
    { name: "Fahrenheit", factor: 0 },
    { name: "Kelvin", factor: 0 },
  ],
  volume: [
    { name: "Liter", factor: 1 },
    { name: "Milliliter", factor: 0.001 },
    { name: "Gallon (US)", factor: 3.78541 },
    { name: "Quart (US)", factor: 0.946353 },
    { name: "Pint (US)", factor: 0.473176 },
    { name: "Cup (US)", factor: 0.236588 },
    { name: "Cubic Meter", factor: 1000 },
  ],
  speed: [
    { name: "m/s", factor: 1 },
    { name: "km/h", factor: 0.277778 },
    { name: "mph", factor: 0.44704 },
    { name: "Knots", factor: 0.514444 },
    { name: "ft/s", factor: 0.3048 },
  ],
  data: [
    { name: "Byte", factor: 1 },
    { name: "Kilobyte", factor: 1024 },
    { name: "Megabyte", factor: 1048576 },
    { name: "Gigabyte", factor: 1073741824 },
    { name: "Terabyte", factor: 1099511627776 },
    { name: "Bit", factor: 0.125 },
  ],
};

const categoryLabels: Record<Category, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  volume: "Volume",
  speed: "Speed",
  data: "Data",
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export default function UnitConverterTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [inputValue, setInputValue] = useState("1");

  const units = unitDefs[category];

  const handleCategoryChange = useCallback((cat: Category) => {
    setCategory(cat);
    const defs = unitDefs[cat];
    setFromUnit(defs[0].name);
    setToUnit(defs.length > 1 ? defs[1].name : defs[0].name);
    setInputValue("1");
  }, []);

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return "";

    if (category === "temperature") {
      return convertTemperature(val, fromUnit, toUnit);
    }

    const fromDef = units.find((u) => u.name === fromUnit);
    const toDef = units.find((u) => u.name === toUnit);
    if (!fromDef || !toDef) return "";

    const baseValue = val * fromDef.factor;
    return baseValue / toDef.factor;
  }, [inputValue, fromUnit, toUnit, category, units]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formatResult = (val: number | string) => {
    if (val === "") return "";
    if (typeof val === "string") return val;
    return val % 1 === 0 ? val.toString() : parseFloat(val.toPrecision(10)).toString();
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
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                category === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-[1fr,auto,1fr]">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mb-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <button
            onClick={handleSwap}
            className="mb-1 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-border)] cursor-pointer"
            title="Swap units"
          >
            <svg className="h-5 w-5 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mb-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
            <div className="w-full rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-accent)]">
              {result !== "" ? formatResult(result) : "—"}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
