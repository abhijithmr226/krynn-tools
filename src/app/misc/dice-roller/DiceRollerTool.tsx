"use client";

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

const DICE_TYPES = [
  { type: "D4", sides: 4 },
  { type: "D6", sides: 6 },
  { type: "D8", sides: 8 },
  { type: "D10", sides: 10 },
  { type: "D12", sides: 12 },
  { type: "D20", sides: 20 },
];

interface RollResult {
  diceType: string;
  count: number;
  values: number[];
  total: number;
  timestamp: number;
}

export default function DiceRollerTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [selectedDice, setSelectedDice] = useState("D6");
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = useCallback(() => {
    setRolling(true);
    setResults([]);

    setTimeout(() => {
      const dice = DICE_TYPES.find((d) => d.type === selectedDice)!;
      const values: number[] = [];
      const array = new Uint32Array(diceCount);
      crypto.getRandomValues(array);
      for (let i = 0; i < diceCount; i++) {
        values.push((array[i] % dice.sides) + 1);
      }

      setResults(values);
      setHistory((prev) => [
        { diceType: selectedDice, count: diceCount, values, total: values.reduce((a, b) => a + b, 0), timestamp: Date.now() },
        ...prev,
      ].slice(0, 50));
      setRolling(false);
    }, 500);
  }, [selectedDice, diceCount]);

  const total = results.length > 0 ? results.reduce((a, b) => a + b, 0) : 0;

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
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Dice Type
          </label>
          <div className="flex flex-wrap gap-2">
            {DICE_TYPES.map((d) => (
              <button
                key={d.type}
                onClick={() => { setSelectedDice(d.type); setResults([]); }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  selectedDice === d.type
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                }`}
              >
                {d.type}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Number of Dice (1-6)
          </label>
          <div className="flex gap-2">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => { setDiceCount(n); setResults([]); }}
                className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  diceCount === n
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button onClick={roll} disabled={rolling} className="btn-primary cursor-pointer">
          {rolling ? (
            <>
              <div className="spinner" />
              Rolling...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Roll {diceCount} {diceCount === 1 ? "Die" : "Dice"}
            </>
          )}
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {results.map((val, i) => (
                <div
                  key={i}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-muted)] text-2xl font-bold text-[var(--color-foreground)] ${rolling ? "animate-bounce" : ""}`}
                >
                  {val}
                </div>
              ))}
            </div>
            {diceCount > 1 && (
              <div className="text-lg font-bold text-[var(--color-primary)]">
                Total: {total}
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Roll History
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.timestamp}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-2 text-sm"
                >
                  <span className="font-medium text-[var(--color-foreground)]">
                    {entry.diceType} x{entry.count}
                  </span>
                  <span className="font-mono text-[var(--color-muted-foreground)]">
                    {entry.values.join(", ")}
                  </span>
                  {entry.count > 1 && (
                    <span className="font-bold text-[var(--color-primary)]">
                      = {entry.total}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
