"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const PRESETS: { name: string; value: string }[] = [
  { name: "Circle", value: "circle(50% at 50% 50%)" },
  { name: "Ellipse", value: "ellipse(50% 40% at 50% 50%)" },
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Pentagon", value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
  { name: "Hexagon", value: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
  { name: "Diamond", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { name: "Star", value: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
  { name: "Cross", value: "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)" },
  { name: "Trapezoid", value: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" },
  { name: "Rounded", value: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)" },
];

export default function ClipPathGeneratorTool({ relatedTools, schema }: Props) {
  const [selected, setSelected] = useState(PRESETS[0].value);
  const [copied, setCopied] = useState(false);

  const cssValue = `clip-path: ${selected};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Clip Path Generator Online Free"
      subtitle="Generate CSS clip-path shapes with live preview."
      howToUse={[
        "Choose a preset shape from the options below.",
        "View the live preview of the shape.",
        "Copy the generated CSS and use it in your project.",
      ]}
      faq={[
        { question: "What is clip-path?", answer: "clip-path is a CSS property that creates a clipping region that determines what parts of an element are visible. It can create circles, polygons, and other shapes." },
        { question: "Which browsers support clip-path?", answer: "clip-path is supported in all modern browsers. For older browsers, you may need SVG fallbacks or prefix with -webkit-." },
        { question: "Can I create custom shapes?", answer: "Yes. Select the polygon preset and modify the coordinates to create any custom shape." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setSelected(p.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                selected === p.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div>
            <label className="mb-4 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div
              className="h-48 w-48 border border-[var(--color-border)] bg-[var(--color-primary)]"
              style={{ clipPath: selected }}
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
