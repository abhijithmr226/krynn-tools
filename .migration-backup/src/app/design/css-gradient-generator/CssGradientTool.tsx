"use client";

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

export default function CssGradientTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [color1, setColor1] = useState("#2563EB");
  const [color2, setColor2] = useState("#059669");
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const cssValue =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const fullCss = `background: ${cssValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCss);
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
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Gradient Type
              </label>
              <div className="flex gap-2">
                {(["linear", "radial"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setGradientType(t)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                      gradientType === t
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Color 1
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Color 2
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            {gradientType === "linear" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                  Angle: {angle}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
                  <span>0°</span>
                  <span>180°</span>
                  <span>360°</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div
              className="h-48 w-full rounded-lg border border-[var(--color-border)]"
              style={{ background: cssValue }}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Generated CSS
          </label>
          <div className="flex items-center gap-3">
            <code className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 font-mono text-sm text-[var(--color-foreground)] overflow-x-auto">
              {fullCss}
            </code>
            <button
              onClick={handleCopy}
              className="btn-primary shrink-0 px-6 py-2.5 font-semibold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
