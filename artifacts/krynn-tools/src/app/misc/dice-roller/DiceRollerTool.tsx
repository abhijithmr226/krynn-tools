import { useState, useCallback, useRef, useEffect } from "react";
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

interface DiceAnimState {
  key: number;
  finalValue: number;
  rolling: boolean;
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
  const [diceAnims, setDiceAnims] = useState<DiceAnimState[]>([]);
  const animTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      animTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setResults([]);

    const dice = DICE_TYPES.find((d) => d.type === selectedDice)!;
    const values: number[] = [];
    const array = new Uint32Array(diceCount);
    crypto.getRandomValues(array);
    for (let i = 0; i < diceCount; i++) {
      values.push((array[i] % dice.sides) + 1);
    }

    const anims: DiceAnimState[] = values.map((val, i) => ({
      key: Date.now() + i,
      finalValue: val,
      rolling: true,
    }));
    setDiceAnims(anims);

    const rollDuration = 1200 + Math.random() * 600;

    values.forEach((val, i) => {
      const delay = i * 80;
      const t = setTimeout(() => {
        setDiceAnims((prev) =>
          prev.map((d, j) => (j === i ? { ...d, rolling: false } : d))
        );
      }, rollDuration + delay);
      animTimeouts.current.push(t);
    });

    const finalTimeout = setTimeout(() => {
      setResults(values);
      setHistory(
        (prev) =>
          [
            {
              diceType: selectedDice,
              count: diceCount,
              values,
              total: values.reduce((a, b) => a + b, 0),
              timestamp: Date.now(),
            },
            ...prev,
          ].slice(0, 50)
      );
      setRolling(false);
      setDiceAnims([]);
    }, rollDuration + values.length * 80 + 200);
    animTimeouts.current.push(finalTimeout);
  }, [selectedDice, diceCount, rolling]);

  const total =
    results.length > 0 ? results.reduce((a, b) => a + b, 0) : 0;

  const getDiceFace = (sides: number, value: number) => {
    if (sides === 6) return value.toString();
    if (sides === 4) return value.toString();
    return value.toString();
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
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Dice Type
          </label>
          <div className="flex flex-wrap gap-2">
            {DICE_TYPES.map((d) => (
              <button
                key={d.type}
                onClick={() => {
                  setSelectedDice(d.type);
                  setResults([]);
                  setDiceAnims([]);
                }}
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
                onClick={() => {
                  setDiceCount(n);
                  setResults([]);
                  setDiceAnims([]);
                }}
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

        <button
          onClick={roll}
          disabled={rolling}
          className="btn-primary w-full cursor-pointer"
        >
          {rolling ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Rolling...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Roll {diceCount} {diceCount === 1 ? "Die" : "Dice"}
            </span>
          )}
        </button>

        {/* Dice Display Area */}
        <div className="mt-6 min-h-[120px]">
          {diceAnims.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {diceAnims.map((dice) => (
                <DiceCube
                  key={dice.key}
                  sides={DICE_TYPES.find((d) => d.type === selectedDice)!.sides}
                  finalValue={dice.finalValue}
                  rolling={dice.rolling}
                />
              ))}
            </div>
          )}

          {results.length > 0 && diceAnims.length === 0 && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
                {results.map((val, i) => (
                  <div
                    key={i}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-card)] text-3xl font-bold text-[var(--color-foreground)] shadow-lg"
                  >
                    {getDiceFace(
                      DICE_TYPES.find((d) => d.type === selectedDice)!.sides,
                      val
                    )}
                  </div>
                ))}
              </div>
              {diceCount > 1 && (
                <div className="text-center text-xl font-bold text-[var(--color-primary)]">
                  Total: {total}
                </div>
              )}
            </div>
          )}
        </div>

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

function DiceCube({
  sides,
  finalValue,
  rolling,
}: {
  sides: number;
  finalValue: number;
  rolling: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(finalValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (rolling) {
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * sides) + 1);
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayValue(finalValue);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [rolling, finalValue, sides]);

  const shapeClass =
    sides === 4
      ? "clip-path-[polygon(50%_0%,0%_100%,100%_100%)]"
      : sides === 8
        ? "clip-path-[polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]"
        : "";

  return (
    <div
      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 text-3xl font-bold text-[var(--color-foreground)] shadow-lg ${
        shapeClass
      }`}
      style={{
        animation: rolling ? "dice-tumble 0.15s ease-in-out infinite" : "dice-land 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <span
        style={{
          animation: rolling ? "dice-number-shuffle 0.08s linear infinite" : "dice-number-land 0.3s ease-out forwards",
        }}
      >
        {displayValue}
      </span>
      <style jsx>{`
        @keyframes dice-tumble {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
          25% { transform: rotateX(15deg) rotateY(-20deg) rotateZ(10deg) scale(1.05); }
          50% { transform: rotateX(-10deg) rotateY(25deg) rotateZ(-15deg) scale(0.95); }
          75% { transform: rotateX(20deg) rotateY(-10deg) rotateZ(8deg) scale(1.02); }
          100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
        }
        @keyframes dice-land {
          0% { transform: rotateX(20deg) rotateY(-15deg) scale(0.9) translateY(-10px); opacity: 0.7; }
          50% { transform: rotateX(-5deg) rotateY(8deg) scale(1.08) translateY(-3px); }
          100% { transform: rotateX(0deg) rotateY(0deg) scale(1) translateY(0); opacity: 1; }
        }
        @keyframes dice-number-shuffle {
          0% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(0.95); }
        }
        @keyframes dice-number-land {
          0% { transform: scale(1.3); opacity: 0.5; }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
