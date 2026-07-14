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

type WeightUnit = "kg" | "lbs";
type HeightUnit = "cm" | "ft";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "var(--color-primary)" };
  if (bmi < 25) return { label: "Normal", color: "var(--color-accent)" };
  if (bmi < 30) return { label: "Overweight", color: "#F59E0B" };
  return { label: "Obese", color: "#EF4444" };
}

export default function BmiCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const handleCalculate = () => {
    let weightKg: number;
    let heightM: number;

    if (weightUnit === "kg") {
      weightKg = parseFloat(weight);
    } else {
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (heightUnit === "cm") {
      heightM = parseFloat(height) / 100;
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      heightM = totalInches * 0.0254;
    }

    if (!weightKg || !heightM || weightKg <= 0 || heightM <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    const cat = getBmiCategory(bmi);
    setResult({ bmi: Math.round(bmi * 10) / 10, category: cat.label, color: cat.color });
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
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                  {(["kg", "lbs"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setWeightUnit(u)}
                      className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                        weightUnit === u
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
                Height
              </label>
              <div className="flex gap-2">
                {heightUnit === "cm" ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <div className="flex flex-1 gap-2">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="ft"
                      className="w-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="in"
                      className="w-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                )}
                <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
                  {(["cm", "ft"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setHeightUnit(u)}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                        heightUnit === u
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                      }`}
                    >
                      {u === "cm" ? "cm" : "ft/in"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full btn-primary px-6 py-2.5 font-semibold cursor-pointer"
            >
              Calculate BMI
            </button>
          </div>

          <div className="flex items-center justify-center">
            {result ? (
              <div className="text-center">
                <div
                  className="mb-3 inline-flex h-28 w-28 items-center justify-center rounded-full border-4"
                  style={{ borderColor: result.color }}
                >
                  <span className="text-3xl font-bold" style={{ color: result.color }}>
                    {result.bmi}
                  </span>
                </div>
                <div className="text-lg font-semibold" style={{ color: result.color }}>
                  {result.category}
                </div>
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  BMI = {result.bmi} kg/m²
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Enter your details and click Calculate
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
