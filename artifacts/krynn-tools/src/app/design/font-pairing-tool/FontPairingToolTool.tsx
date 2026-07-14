import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const PAIRINGS = [
  { heading: "Playfair Display", body: "Source Sans Pro", style: "Elegant & Classic" },
  { heading: "Montserrat", body: "Merriweather", style: "Modern & Readable" },
  { heading: "Oswald", body: "Lato", style: "Bold & Clean" },
  { heading: "Raleway", body: "Roboto", style: "Minimal & Professional" },
  { heading: "Poppins", body: "Inter", style: "Geometric & Friendly" },
  { heading: "Bebas Neue", body: "Open Sans", style: "Impactful & Versatile" },
  { heading: "DM Serif Display", body: "DM Sans", style: "Harmonious & Balanced" },
  { heading: "Space Grotesk", body: "Space Mono", style: "Techy & Monospace" },
  { heading: "Crimson Pro", body: "Work Sans", style: "Literary & Modern" },
  { heading: "Bitter", body: "Rubik", style: "Warm & Contemporary" },
  { heading: "Archivo Black", body: "Nunito", style: "Strong & Soft" },
  { heading: "Sora", body: "Lora", style: "Futuristic & Traditional" },
];

export default function FontPairingToolTool({ relatedTools, schema }: Props) {
  const [selected, setSelected] = useState(0);
  const pair = PAIRINGS[selected];

  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g, "+")}:wght@700&family=${pair.body.replace(/ /g, "+")}:ital,wght@0,400;0,700;1,400&display=swap`;

  const cssCode = `/* Google Fonts Import */\n@import url('${googleFontsUrl}');\n\n/* CSS */\nh1, h2, h3 {\n  font-family: '${pair.heading}', serif;\n}\n\nbody, p {\n  font-family: '${pair.body}', sans-serif;\n}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Font Pairing Tool Online Free"
      subtitle="Discover beautiful font pairings for headings and body text."
      howToUse={[
        "Browse through curated font pairing combinations.",
        "Preview how heading and body fonts look together.",
        "Copy the CSS import and styles to use in your project.",
      ]}
      faq={[
        { question: "How do I choose a font pairing?", answer: "Good pairings contrast but complement each other. Pair a serif with a sans-serif, or a display font with a neutral body font." },
        { question: "Are these Google Fonts?", answer: "Yes. All fonts are from Google Fonts, making them free to use and easy to import via CSS." },
        { question: "Can I use these commercially?", answer: "Yes. All Google Fonts are free for personal and commercial use under open source licenses." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {PAIRINGS.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                selected === i
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {p.style}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-sm text-[var(--color-muted-foreground)]">Heading:</span>
            <span className="text-lg font-bold text-[var(--color-primary)]">{pair.heading}</span>
          </div>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-sm text-[var(--color-muted-foreground)]">Body:</span>
            <span className="text-lg font-bold text-[var(--color-primary)]">{pair.body}</span>
          </div>

          <div
            style={{
              fontFamily: `'${pair.heading}', serif`,
            }}
          >
            <h2 className="mb-3 text-3xl font-bold text-[var(--color-foreground)]">
              The Quick Brown Fox Jumps Over
            </h2>
          </div>
          <div
            style={{
              fontFamily: `'${pair.body}', sans-serif`,
            }}
          >
            <p className="text-base leading-relaxed text-[var(--color-muted-foreground)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-foreground)]">CSS Code</span>
            <button onClick={handleCopy} className="btn-primary px-6 py-2.5 font-semibold cursor-pointer">
              {copied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)]">
            {cssCode}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
