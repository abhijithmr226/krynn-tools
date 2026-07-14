import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface Criteria {
  label: string;
  met: boolean;
}

function analyzePassword(pwd: string): { strength: string; color: string; percent: number; criteria: Criteria[]; entropy: number } {
  const criteria: Criteria[] = [
    { label: "At least 8 characters", met: pwd.length >= 8 },
    { label: "At least 12 characters", met: pwd.length >= 12 },
    { label: "Contains uppercase letter (A-Z)", met: /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter (a-z)", met: /[a-z]/.test(pwd) },
    { label: "Contains number (0-9)", met: /[0-9]/.test(pwd) },
    { label: "Contains special character (!@#$...)", met: /[^A-Za-z0-9]/.test(pwd) },
    { label: "No common patterns", met: !/(.)\1{2,}|012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pwd) },
  ];

  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;

  const entropy = pwd.length > 0 ? pwd.length * Math.log2(pool || 1) : 0;
  if (pwd.length === 0) return { strength: "Enter a password", color: "var(--color-muted-foreground)", percent: 0, criteria, entropy: 0 };
  if (entropy < 30) return { strength: "Very Weak", color: "#DC2626", percent: 15, criteria, entropy: Math.round(entropy) };
  if (entropy < 50) return { strength: "Weak", color: "#F97316", percent: 30, criteria, entropy: Math.round(entropy) };
  if (entropy < 70) return { strength: "Fair", color: "#F59E0B", percent: 50, criteria, entropy: Math.round(entropy) };
  if (entropy < 90) return { strength: "Strong", color: "#059669", percent: 75, criteria, entropy: Math.round(entropy) };
  return { strength: "Very Strong", color: "#2563EB", percent: 100, criteria, entropy: Math.round(entropy) };
}

export default function PasswordStrengthCheckerTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);

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
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Enter Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password here..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 pr-12 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] cursor-pointer"
              type="button"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {password.length > 0 && (
          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-foreground)]">Strength</span>
                <span className="text-sm font-bold" style={{ color: analysis.color }}>{analysis.strength}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysis.percent}%`, backgroundColor: analysis.color }}
                />
              </div>
              {analysis.entropy > 0 && (
                <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  Entropy: {analysis.entropy} bits
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-[var(--color-foreground)]">Criteria</div>
              {analysis.criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  {c.met ? (
                    <svg className="h-4 w-4 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={`text-sm ${c.met ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
