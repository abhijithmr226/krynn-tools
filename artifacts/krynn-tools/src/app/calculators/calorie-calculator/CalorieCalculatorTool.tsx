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

const activityLevels = [
  { label: "Sedentary (little/no exercise)", factor: 1.2 },
  { label: "Light (1-3 days/week)", factor: 1.375 },
  { label: "Moderate (3-5 days/week)", factor: 1.55 },
  { label: "Active (6-7 days/week)", factor: 1.725 },
  { label: "Very Active (athlete)", factor: 1.9 },
];

export default function CalorieCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityIndex, setActivityIndex] = useState(0);
  const [result, setResult] = useState<{ bmr: number; tdee: number; lose: number; maintain: number; gain: number } | null>(null);

  const handleCalculate = () => {
    const a = parseInt(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = Math.round(bmr * activityLevels[activityIndex].factor);
    setResult({
      bmr: Math.round(bmr),
      tdee,
      lose: tdee - 500,
      maintain: tdee,
      gain: tdee + 500,
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
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Age (years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 30"
              min="1"
              max="120"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Gender</label>
            <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)]">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                    gender === g
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
              min="0"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Activity Level</label>
          <div className="space-y-2">
            {activityLevels.map((level, i) => (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors duration-200 ${
                  activityIndex === i
                    ? "border-[var(--color-primary)] bg-[var(--color-muted)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <input
                  type="radio"
                  name="activity"
                  checked={activityIndex === i}
                  onChange={() => setActivityIndex(i)}
                  className="accent-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-foreground)]">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary mt-6 w-full cursor-pointer">
          Calculate Calories
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">BMR</div>
                <div className="mt-1 text-2xl font-bold text-[var(--color-primary)]">
                  {result.bmr.toLocaleString()} <span className="text-sm font-normal">cal/day</span>
                </div>
              </div>
              <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
                <div className="text-sm text-[var(--color-muted-foreground)]">TDEE</div>
                <div className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                  {result.tdee.toLocaleString()} <span className="text-sm font-normal">cal/day</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-xs font-medium text-[var(--color-muted-foreground)]">Lose Weight</div>
                <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{result.lose.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">cal/day</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-xs font-medium text-[var(--color-muted-foreground)]">Maintain</div>
                <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{result.maintain.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">cal/day</div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <div className="text-xs font-medium text-[var(--color-muted-foreground)]">Gain Weight</div>
                <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{result.gain.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">cal/day</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
