"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function BoxShadowGeneratorTool({ relatedTools, schema }: Props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const rgba = `${color}${Math.round(opacity * 2.55).toString(16).padStart(2, "0")}`;
  const shadowValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const cssValue = `box-shadow: ${shadowValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Box Shadow Generator Online Free"
      subtitle="Generate CSS box shadows with live preview."
      howToUse={[
        "Adjust the sliders for horizontal offset, vertical offset, blur, and spread.",
        "Pick a shadow color and set the opacity.",
        "Toggle inset for inner shadows and copy the generated CSS.",
      ]}
      faq={[
        { question: "What is a box shadow?", answer: "A box shadow adds a shadow effect around an element. It takes horizontal and vertical offsets, blur radius, spread radius, and color." },
        { question: "What is an inset shadow?", answer: "An inset shadow appears inside the element's border rather than outside. It creates a recessed or inner glow effect." },
        { question: "Can I add multiple shadows?", answer: "Yes. Copy the generated CSS and add multiple box-shadow values separated by commas." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            {[
              { label: "Horizontal Offset", value: x, set: setX, min: -100, max: 100 },
              { label: "Vertical Offset", value: y, set: setY, min: -100, max: 100 },
              { label: "Blur Radius", value: blur, set: setBlur, min: 0, max: 200 },
              { label: "Spread Radius", value: spread, set: setSpread, min: -100, max: 100 },
              { label: "Opacity", value: opacity, set: setOpacity, min: 0, max: 100 },
            ].map((s) => (
              <div key={s.label}>
                <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                  {s.label}: {s.value}
                </label>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </div>
            ))}

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[var(--color-foreground)]">Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent"
              />
              <span className="font-mono text-sm text-[var(--color-muted-foreground)]">{color}</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Inset shadow</span>
            </label>
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="mb-4 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div
              className="h-48 w-48 rounded-xl border border-[var(--color-border)] bg-white"
              style={{ boxShadow: shadowValue }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 font-mono text-sm text-[var(--color-foreground)] overflow-x-auto">
            {cssValue}
          </code>
          <button onClick={handleCopy} className="btn-primary shrink-0 px-6 py-2.5 font-semibold cursor-pointer">
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
