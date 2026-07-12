"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface AnimationPreset {
  name: string;
  keyframes: string;
  animation: string;
}

const PRESETS: AnimationPreset[] = [
  {
    name: "Fade In",
    keyframes: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}`,
    animation: "animation: fadeIn 0.5s ease-in-out forwards;",
  },
  {
    name: "Fade Out",
    keyframes: `@keyframes fadeOut {\n  from { opacity: 1; }\n  to { opacity: 0; }\n}`,
    animation: "animation: fadeOut 0.5s ease-in-out forwards;",
  },
  {
    name: "Slide Up",
    keyframes: `@keyframes slideUp {\n  from { transform: translateY(30px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}`,
    animation: "animation: slideUp 0.5s ease-out forwards;",
  },
  {
    name: "Slide Down",
    keyframes: `@keyframes slideDown {\n  from { transform: translateY(-30px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}`,
    animation: "animation: slideDown 0.5s ease-out forwards;",
  },
  {
    name: "Slide Left",
    keyframes: `@keyframes slideLeft {\n  from { transform: translateX(30px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}`,
    animation: "animation: slideLeft 0.5s ease-out forwards;",
  },
  {
    name: "Slide Right",
    keyframes: `@keyframes slideRight {\n  from { transform: translateX(-30px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}`,
    animation: "animation: slideRight 0.5s ease-out forwards;",
  },
  {
    name: "Bounce",
    keyframes: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}`,
    animation: "animation: bounce 0.6s ease-in-out infinite;",
  },
  {
    name: "Spin",
    keyframes: `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}`,
    animation: "animation: spin 1s linear infinite;",
  },
  {
    name: "Pulse",
    keyframes: `@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}`,
    animation: "animation: pulse 1s ease-in-out infinite;",
  },
  {
    name: "Shake",
    keyframes: `@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-5px); }\n  75% { transform: translateX(5px); }\n}`,
    animation: "animation: shake 0.5s ease-in-out infinite;",
  },
  {
    name: "Flip",
    keyframes: `@keyframes flip {\n  from { transform: perspective(400px) rotateY(0); }\n  to { transform: perspective(400px) rotateY(360deg); }\n}`,
    animation: "animation: flip 1s ease-in-out;",
  },
  {
    name: "Zoom In",
    keyframes: `@keyframes zoomIn {\n  from { transform: scale(0); opacity: 0; }\n  to { transform: scale(1); opacity: 1; }\n}`,
    animation: "animation: zoomIn 0.5s ease-out forwards;",
  },
];

export default function CssAnimationGeneratorTool({ relatedTools, schema }: Props) {
  const [selected, setSelected] = useState(0);
  const [duration, setDuration] = useState(0.5);
  const [copied, setCopied] = useState(false);

  const preset = PRESETS[selected];

  const customAnimation = preset.animation.replace(
    /[\d.]+s/,
    `${duration}s`
  );

  const fullCode = `${preset.keyframes}\n\n.element {\n  ${customAnimation}\n}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    const el = document.getElementById("animation-preview");
    if (el) {
      el.style.animation = "none";
      el.offsetHeight;
      el.style.animation = customAnimation;
    }
  };

  return (
    <ToolLayout
      title="CSS Animation Generator Online Free"
      subtitle="Generate CSS keyframe animations with live preview."
      howToUse={[
        "Choose an animation type from the presets.",
        "Adjust the duration to control animation speed.",
        "Copy the generated CSS keyframes and animation code.",
      ]}
      faq={[
        { question: "What are CSS keyframes?", answer: "Keyframes define the stages and styles of a CSS animation. They specify what happens at each point during the animation cycle." },
        { question: "How do I apply this animation?", answer: "Copy the CSS code, add the @keyframes rule to your stylesheet, then apply the animation property to the element you want to animate." },
        { question: "Can I customize these further?", answer: "Yes. Use the generated code as a starting point and modify the keyframe percentages, transform values, or timing functions." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                selected === i
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Duration: {duration}s
              </label>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            <button onClick={handleReplay} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
              Replay Animation
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="mb-4 block text-sm font-medium text-[var(--color-foreground)]">
              Live Preview
            </label>
            <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]">
              <div
                id="animation-preview"
                className="h-16 w-16 rounded-lg bg-white"
                style={{ animation: customAnimation }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <pre className="flex-1 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] max-h-64">
            {fullCode}
          </pre>
          <button onClick={handleCopy} className="btn-primary shrink-0 px-6 py-2.5 font-semibold cursor-pointer">
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
