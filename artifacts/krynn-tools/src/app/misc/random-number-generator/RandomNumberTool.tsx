import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RandomNumberTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    setError("");
    if (min > max) {
      setError("Minimum value must be less than or equal to maximum.");
      setNumbers([]);
      return;
    }
    if (unique && count > max - min + 1) {
      setError(`Cannot generate ${count} unique numbers in range ${min}-${max}. Maximum is ${max - min + 1}.`);
      setNumbers([]);
      return;
    }

    const results: number[] = [];
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);

    if (unique) {
      const used = new Set<number>();
      for (let i = 0; i < count; i++) {
        let num: number;
        do {
          num = min + (array[i] % (max - min + 1));
        } while (used.has(num));
        used.add(num);
        results.push(num);
      }
    } else {
      for (let i = 0; i < count; i++) {
        results.push(min + (array[i] % (max - min + 1)));
      }
    }

    setNumbers(results);
    setCopied(false);
  }, [min, max, count, unique]);

  const handleCopyAll = async () => {
    if (numbers.length === 0) return;
    await navigator.clipboard.writeText(numbers.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Minimum Value
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Maximum Value
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Count (1-100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              Unique numbers only (no duplicates)
            </span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="btn-primary cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate Numbers
          </button>
          {numbers.length > 0 && (
            <button onClick={handleCopyAll} className="btn-secondary cursor-pointer">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? "Copied!" : "Copy All"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-[var(--color-destructive)] bg-red-50 p-4 text-sm text-[var(--color-destructive)]">
            {error}
          </div>
        )}

        {numbers.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">
              Results ({numbers.length} numbers)
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {numbers.map((num, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-2 py-2 font-mono text-sm font-semibold text-[var(--color-foreground)]"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
