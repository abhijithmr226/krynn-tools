import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import chroma from "chroma-js";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type PaletteType = "complementary" | "analogous" | "triadic" | "split-complementary";

function generatePalette(seed: string, type: PaletteType): string[] {
  const base = chroma(seed);
  const h = base.get("hsl.h") || 0;
  const s = base.get("hsl.s");
  const l = base.get("hsl.l");

  switch (type) {
    case "complementary":
      return [seed, chroma.hsl((h + 180) % 360, s, l).hex()];
    case "analogous":
      return [
        chroma.hsl((h + 330) % 360, s, l).hex(),
        seed,
        chroma.hsl((h + 30) % 360, s, l).hex(),
      ];
    case "triadic":
      return [
        seed,
        chroma.hsl((h + 120) % 360, s, l).hex(),
        chroma.hsl((h + 240) % 360, s, l).hex(),
      ];
    case "split-complementary":
      return [
        seed,
        chroma.hsl((h + 150) % 360, s, l).hex(),
        chroma.hsl((h + 210) % 360, s, l).hex(),
      ];
    default:
      return [seed];
  }
}

export default function ColorPaletteTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [seedColor, setSeedColor] = useState("#2563EB");
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const palette = useMemo(() => generatePalette(seedColor, paletteType), [seedColor, paletteType]);

  const handleCopy = useCallback(async (hex: string, index: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const paletteTypes: { value: PaletteType; label: string }[] = [
    { value: "complementary", label: "Complementary" },
    { value: "analogous", label: "Analogous" },
    { value: "triadic", label: "Triadic" },
    { value: "split-complementary", label: "Split Complementary" },
  ];

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      howToUse={howToUse}
      faq={faq}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Seed Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={seedColor}
                onChange={(e) => setSeedColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent"
              />
              <input
                type="text"
                value={seedColor}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setSeedColor(e.target.value);
                }}
                className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Palette Type
            </label>
            <div className="flex flex-wrap gap-2">
              {paletteTypes.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setPaletteType(pt.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    paletteType === pt.value
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palette.map((hex, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--color-border)] overflow-hidden"
            >
              <div
                className="h-32 w-full"
                style={{ backgroundColor: hex }}
              />
              <div className="flex items-center justify-between p-3 bg-[var(--color-background)]">
                <span className="font-mono text-sm font-semibold text-[var(--color-foreground)]">
                  {hex.toUpperCase()}
                </span>
                <button
                  onClick={() => handleCopy(hex, i)}
                  className="cursor-pointer rounded-md bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)] transition-colors duration-200 hover:bg-[var(--color-border)]"
                >
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
