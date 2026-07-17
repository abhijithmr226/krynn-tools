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

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}


function evalExpression(expr: string): number {
  const clean = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, `${Math.PI}`)
    .replace(/e(?![xp])/g, `${Math.E}`);

  let pos = 0;

  function peek(): string {
    return clean[pos] || '';
  }

  function consume(char?: string): string {
    const c = clean[pos] || '';
    if (char && c !== char) {
      throw new Error(`Expected ${char} but got ${c}`);
    }
    if (pos < clean.length) pos++;
    return c;
  }

  function isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  function parsePrimary(): number {
    let c = peek();

    // Skip whitespace
    while (c === ' ') {
      consume();
      c = peek();
    }

    if (c === '(') {
      consume('(');
      const val = parseAddSub();
      consume(')');
      return val;
    }

    if (c === '-') {
      consume('-');
      return -parsePrimary();
    }
    if (c === '+') {
      consume('+');
      return parsePrimary();
    }

    const checkAndConsumeFunc = (name: string): boolean => {
      if (clean.slice(pos).startsWith(name + '(')) {
        pos += name.length + 1; // consume name and '('
        return true;
      }
      return false;
    };

    if (checkAndConsumeFunc('sin')) {
      const val = parseAddSub();
      consume(')');
      return Math.sin(val * Math.PI / 180);
    }
    if (checkAndConsumeFunc('cos')) {
      const val = parseAddSub();
      consume(')');
      return Math.cos(val * Math.PI / 180);
    }
    if (checkAndConsumeFunc('tan')) {
      const val = parseAddSub();
      consume(')');
      return Math.tan(val * Math.PI / 180);
    }
    if (checkAndConsumeFunc('log')) {
      const val = parseAddSub();
      consume(')');
      return Math.log10(val);
    }
    if (checkAndConsumeFunc('ln')) {
      const val = parseAddSub();
      consume(')');
      return Math.log(val);
    }
    if (checkAndConsumeFunc('sqrt')) {
      const val = parseAddSub();
      consume(')');
      return Math.sqrt(val);
    }

    if (isDigit(c) || c === '.') {
      const start = pos;
      if (c === '.') consume('.');
      while (isDigit(peek())) consume();
      if (peek() === '.' && c !== '.') {
        consume('.');
        while (isDigit(peek())) consume();
      }
      let num = parseFloat(clean.slice(start, pos));

      // Factorial support
      if (peek() === '!') {
        consume('!');
        num = factorial(num);
      }

      return num;
    }

    throw new Error(`Unexpected character "${c}"`);
  }

  function parseExponent(): number {
    let val = parsePrimary();
    while (peek() === '^') {
      consume('^');
      const exp = parseExponent();
      val = Math.pow(val, exp);
    }
    return val;
  }

  function parseMulDiv(): number {
    let val = parseExponent();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseExponent();
      if (op === '*') val *= right;
      else val /= right;
    }
    return val;
  }

  function parseAddSub(): number {
    let val = parseMulDiv();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseMulDiv();
      if (op === '+') val += right;
      else val -= right;
    }
    return val;
  }

  const result = parseAddSub();
  if (pos < clean.length) {
    throw new Error(`Extra characters starting at "${clean.slice(pos)}"`);
  }
  return result;
}

const buttons = [
  ["sin", "cos", "tan", "π", "e"],
  ["log", "ln", "sqrt", "(", ")"],
  ["7", "8", "9", "÷", "C"],
  ["4", "5", "6", "×", "^"],
  ["1", "2", "3", "-", "!"],
  ["0", ".", "=", "+", "DEL"],
];

export default function ScientificCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleButton = useCallback((btn: string) => {
    setError(false);

    if (btn === "C") {
      setDisplay("");
      setResult(null);
      return;
    }

    if (btn === "DEL") {
      setDisplay((p) => p.slice(0, -1));
      return;
    }

    if (btn === "=") {
      try {
        const val = evalExpression(display);
        if (isNaN(val) || !isFinite(val)) {
          setError(true);
          setResult("Error");
        } else {
          setResult(Number(val.toPrecision(12)).toString());
        }
      } catch {
        setError(true);
        setResult("Error");
      }
      return;
    }

    if (["sin", "cos", "tan", "log", "ln", "sqrt"].includes(btn)) {
      setDisplay((p) => p + btn + "(");
      return;
    }

    if (btn === "^") {
      setDisplay((p) => p + "^");
      return;
    }

    setDisplay((p) => p + btn);
  }, [display]);

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
        <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <div className="text-right font-mono text-sm text-[var(--color-muted-foreground)] min-h-[1.5rem] break-all">
            {display || "0"}
          </div>
          <div className={`mt-1 text-right font-mono text-2xl font-bold ${error ? "text-[var(--color-destructive)]" : "text-[var(--color-foreground)]"}`}>
            {result !== null ? result : ""}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handleButton(btn)}
              className={`flex h-12 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                btn === "="
                  ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                  : btn === "C"
                  ? "bg-[var(--color-destructive)] text-white hover:opacity-90"
                  : ["sin", "cos", "tan", "log", "ln", "sqrt", "π", "e", "!"].includes(btn)
                  ? "bg-[var(--color-accent)] text-white hover:opacity-90"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
