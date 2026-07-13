"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type Platform = "instagram" | "tiktok" | "twitter";

interface PlatformRules {
  label: string;
  minLength: number;
  maxLength: number;
  allowedChars: RegExp;
  allowedCharsDesc: string;
  noStartPeriod: boolean;
  noEndPeriod: boolean;
  noConsecutivePeriods: boolean;
  noOnlyPeriods: boolean;
}

const PLATFORMS: Record<Platform, PlatformRules> = {
  instagram: {
    label: "Instagram",
    minLength: 1,
    maxLength: 30,
    allowedChars: /^[a-zA-Z0-9._]+$/,
    allowedCharsDesc: "Letters, numbers, periods, and underscores",
    noStartPeriod: true,
    noEndPeriod: true,
    noConsecutivePeriods: true,
    noOnlyPeriods: true,
  },
  tiktok: {
    label: "TikTok",
    minLength: 2,
    maxLength: 24,
    allowedChars: /^[a-zA-Z0-9._-]+$/,
    allowedCharsDesc: "Letters, numbers, periods, underscores, and dashes",
    noStartPeriod: false,
    noEndPeriod: false,
    noConsecutivePeriods: false,
    noOnlyPeriods: false,
  },
  twitter: {
    label: "Twitter / X",
    minLength: 1,
    maxLength: 15,
    allowedChars: /^[a-zA-Z0-9_]+$/,
    allowedCharsDesc: "Letters, numbers, and underscores only",
    noStartPeriod: false,
    noEndPeriod: false,
    noConsecutivePeriods: false,
    noOnlyPeriods: false,
  },
};

interface RuleResult {
  label: string;
  passed: boolean;
}

function validateUsername(username: string, platform: Platform): RuleResult[] {
  const rules = PLATFORMS[platform];
  const results: RuleResult[] = [];

  results.push({
    label: `Between ${rules.minLength} and ${rules.maxLength} characters`,
    passed: username.length >= rules.minLength && username.length <= rules.maxLength,
  });

  results.push({
    label: `Only ${rules.allowedCharsDesc}`,
    passed: rules.allowedChars.test(username),
  });

  if (rules.noStartPeriod) {
    results.push({
      label: "Cannot start with a period",
      passed: username.length === 0 || username[0] !== ".",
    });
  }

  if (rules.noEndPeriod) {
    results.push({
      label: "Cannot end with a period",
      passed: username.length === 0 || username[username.length - 1] !== ".",
    });
  }

  if (rules.noConsecutivePeriods) {
    results.push({
      label: "No consecutive periods",
      passed: !/\.\./.test(username),
    });
  }

  if (rules.noOnlyPeriods) {
    results.push({
      label: "Cannot contain only periods",
      passed: username.length === 0 || !/^\.+$/.test(username),
    });
  }

  return results;
}

function generateSuggestion(username: string, platform: Platform): string {
  const rules = PLATFORMS[platform];
  let suggestion = username
    .toLowerCase()
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/\.{2,}/g, ".");

  if (rules.noStartPeriod && suggestion.startsWith(".")) {
    suggestion = suggestion.slice(1);
  }
  if (rules.noEndPeriod && suggestion.endsWith(".")) {
    suggestion = suggestion.slice(0, -1);
  }

  if (suggestion.length < rules.minLength) {
    suggestion = suggestion.padEnd(rules.minLength, "0");
  }
  if (suggestion.length > rules.maxLength) {
    suggestion = suggestion.slice(0, rules.maxLength);
  }

  if (!suggestion) suggestion = "user" + Math.floor(Math.random() * 9999);

  return suggestion;
}

export default function UsernameValidatorTool({ relatedTools, schema }: Props) {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [copied, setCopied] = useState(false);

  const trimmed = username.trim();
  const results = useMemo(() => validateUsername(trimmed, platform), [trimmed, platform]);
  const allPassed = trimmed.length > 0 && results.every((r) => r.passed);
  const suggestion = useMemo(() => generateSuggestion(trimmed, platform), [trimmed, platform]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [trimmed]);

  return (
    <ToolLayout
      title="Username Validator & Format Checker"
      subtitle="Check if a username meets platform requirements. Validate length, characters, and format rules instantly."
      howToUse={[
        "Select the platform you want to validate against: Instagram, TikTok, or Twitter/X.",
        "Type a username into the input field.",
        "Watch the rule checklist update in real-time with green checkmarks or red X marks.",
        "If the username is invalid, use the suggestion to find a valid alternative.",
      ]}
      faq={[
        { question: "What characters are allowed in Instagram usernames?", answer: "Instagram usernames can only contain letters, numbers, periods, and underscores. They must be 1-30 characters long, cannot start or end with a period, and cannot have consecutive periods." },
        { question: "Can I change my username?", answer: "Yes, most platforms allow you to change your username. However, your old username may not be immediately available for someone else to claim." },
        { question: "Is this tool affiliated with Instagram?", answer: "No. This is an independent tool. We validate against publicly known username rules, but always check the platform's official guidelines." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1">
          {(Object.keys(PLATFORMS) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                platform === p
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              }`}
            >
              {PLATFORMS[p].label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">Enter Username</label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--color-primary)]">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="flex-1 bg-transparent text-lg font-semibold text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none"
            />
          </div>
        </div>

        {trimmed && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Preview
              </span>
              <span className={`text-sm font-bold ${allPassed ? "text-green-500" : "text-red-500"}`}>
                {allPassed ? "Valid" : "Invalid"}
              </span>
            </div>
            <div className="rounded-md bg-[var(--color-muted)] px-4 py-3 text-center">
              <span className="text-lg font-bold text-[var(--color-foreground)]">@{trimmed}</span>
            </div>
          </div>
        )}

        {trimmed && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">Validation Rules</h3>
            <div className="space-y-2">
              {results.map((rule, i) => (
                <div key={i} className="flex items-center gap-3">
                  {rule.passed ? (
                    <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className={`text-sm ${rule.passed ? "text-[var(--color-foreground)]" : "text-red-500"}`}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!allPassed && trimmed && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">Suggestion</h3>
            <p className="mb-3 text-sm text-[var(--color-muted-foreground)]">
              Here is a valid username based on your input:
            </p>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-[var(--color-muted)] px-4 py-2 font-bold text-[var(--color-primary)]">@{suggestion}</span>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(suggestion);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn-secondary px-4 py-2 text-sm font-semibold cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {allPassed && (
          <div className="flex gap-3">
            <button onClick={handleCopy} className="btn-primary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy Username"}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
