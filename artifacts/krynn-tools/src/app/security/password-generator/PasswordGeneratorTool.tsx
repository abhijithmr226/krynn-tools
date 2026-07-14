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

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function getStrength(length: number, options: Options): { label: string; color: string; percent: number } {
  const pool =
    (options.uppercase ? 26 : 0) +
    (options.lowercase ? 26 : 0) +
    (options.numbers ? 10 : 0) +
    (options.symbols ? 32 : 0);
  if (pool === 0 || length < 8) return { label: "Very Weak", color: "var(--color-destructive)", percent: 10 };
  const entropy = length * Math.log2(pool);
  if (entropy < 40) return { label: "Weak", color: "var(--color-destructive)", percent: 25 };
  if (entropy < 60) return { label: "Fair", color: "var(--color-warning)", percent: 50 };
  if (entropy < 80) return { label: "Strong", color: "var(--color-accent)", percent: 75 };
  return { label: "Very Strong", color: "var(--color-accent)", percent: 100 };
}

export default function PasswordGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [options, setOptions] = useState<Options>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (options.uppercase) charset += upper;
    if (options.lowercase) charset += lower;
    if (options.numbers) charset += nums;
    if (options.symbols) charset += syms;

    if (!charset) {
      setPassword("Select at least one character type");
      return;
    }

    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (v) => charset[v % charset.length]).join("");
    setPassword(result);
    setCopied(false);
  }, [options]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(options.length, options);

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
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
            Password Length: <span className="text-[var(--color-primary)]">{options.length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => setOptions((p) => ({ ...p, length: Number(e.target.value) }))}
            className="w-full cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            { key: "uppercase" as const, label: "Uppercase (A-Z)" },
            { key: "lowercase" as const, label: "Lowercase (a-z)" },
            { key: "numbers" as const, label: "Numbers (0-9)" },
            { key: "symbols" as const, label: "Symbols (!@#)" },
          ]).map((opt) => (
            <label
              key={opt.key}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2.5 transition-colors duration-200 hover:border-[var(--color-primary)]"
            >
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={(e) => setOptions((p) => ({ ...p, [opt.key]: e.target.checked }))}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-foreground)]">{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={generate} className="btn-primary cursor-pointer">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate Password
        </button>

        {password && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-lg break-all text-[var(--color-foreground)]">
                {password}
              </div>
              <button
                onClick={handleCopy}
                className="btn-secondary shrink-0 cursor-pointer px-4 py-3"
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-foreground)]">Strength</span>
                <span className="text-sm font-semibold" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
