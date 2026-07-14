import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function generateWavePath(width: number, height: number, amplitude: number, frequency: number, phase: number): string {
  const points: string[] = [`M 0 ${height}`];
  for (let x = 0; x <= width; x += 2) {
    const y = height / 2 + amplitude * Math.sin((x * frequency * Math.PI) / width + phase);
    points.push(`L ${x} ${y}`);
  }
  points.push(`L ${width} ${height}`, "Z");
  return points.join(" ");
}

export default function SvgWaveGeneratorTool({ relatedTools, schema }: Props) {
  const [amplitude, setAmplitude] = useState(30);
  const [frequency, setFrequency] = useState(2);
  const [color, setColor] = useState("#3b82f6");
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(1440);
  const [copied, setCopied] = useState(false);

  const path = useMemo(() => generateWavePath(width, height, amplitude, frequency, 0), [width, height, amplitude, frequency]);

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
  <path d="${path}" fill="${color}" />
</svg>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="SVG Wave Generator Online Free"
      subtitle="Generate customizable SVG wave shapes for your web projects."
      howToUse={[
        "Adjust the amplitude and frequency sliders to shape the wave.",
        "Pick a color and set the dimensions.",
        "Copy the generated SVG code to use in your HTML or CSS.",
      ]}
      faq={[
        { question: "What is an SVG wave?", answer: "An SVG wave is a scalable vector graphic that creates a wave-like shape, commonly used as section dividers on websites." },
        { question: "How do I use this in my project?", answer: "Copy the SVG code and paste it into your HTML. You can also use it as a CSS background or an img src." },
        { question: "Is SVG better than an image for waves?", answer: "Yes. SVGs are infinitely scalable, smaller in file size, and can be styled with CSS. They look sharp at any resolution." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Amplitude: {amplitude}px
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Frequency: {frequency}
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Height: {height}px
              </label>
              <input
                type="range"
                min={50}
                max={500}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

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
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="mb-4 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div className="w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="h-48 w-full"
              >
                <path d={path} fill={color} />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <code className="flex-1 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 font-mono text-xs text-[var(--color-foreground)]">
            {svgCode}
          </code>
          <button onClick={handleCopy} className="btn-primary shrink-0 px-6 py-2.5 font-semibold cursor-pointer">
            {copied ? "Copied!" : "Copy SVG"}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
