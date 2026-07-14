import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function BorderRadiusGeneratorTool({ relatedTools, schema }: Props) {
  const [topLeft, setTopLeft] = useState(0);
  const [topRight, setTopRight] = useState(0);
  const [bottomRight, setBottomRight] = useState(0);
  const [bottomLeft, setBottomLeft] = useState(0);
  const [linked, setLinked] = useState(true);
  const [copied, setCopied] = useState(false);

  const setAll = (v: number) => {
    setTopLeft(v);
    setTopRight(v);
    setBottomRight(v);
    setBottomLeft(v);
  };

  const handleCorner = (corner: string, value: number) => {
    if (linked) {
      setAll(value);
    } else {
      switch (corner) {
        case "tl": setTopLeft(value); break;
        case "tr": setTopRight(value); break;
        case "br": setBottomRight(value); break;
        case "bl": setBottomLeft(value); break;
      }
    }
  };

  const cssValue = `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Border Radius Generator Online Free"
      subtitle="Generate CSS border-radius with live preview."
      howToUse={[
        "Adjust the radius for each corner using the sliders.",
        "Toggle Link Corners to apply the same radius to all corners.",
        "Preview the shape and copy the generated CSS.",
      ]}
      faq={[
        { question: "What is border-radius?", answer: "border-radius is a CSS property that rounds the corners of an element. You can set different values for each corner." },
        { question: "What does 'Link Corners' do?", answer: "When linked, all four corners share the same radius value. When unlinked, you can set each corner independently." },
        { question: "How do I make a circle?", answer: "Set all corner radii to 50% or to at least half the element's width/height to create a circle." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={linked}
                onChange={(e) => {
                  setLinked(e.target.checked);
                  if (e.target.checked) setAll(topLeft);
                }}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Link Corners</span>
            </label>

            {[
              { label: "Top Left", corner: "tl", value: topLeft },
              { label: "Top Right", corner: "tr", value: topRight },
              { label: "Bottom Right", corner: "br", value: bottomRight },
              { label: "Bottom Left", corner: "bl", value: bottomLeft },
            ].map((c) => (
              <div key={c.corner}>
                <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                  {c.label}: {c.value}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={c.value}
                  onChange={(e) => handleCorner(c.corner, Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="mb-4 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div
              className="h-48 w-48 border-4 border-[var(--color-primary)] bg-[var(--color-primary)]/10"
              style={{ borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px` }}
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
