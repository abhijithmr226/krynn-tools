import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const WORDS = [
  "apple","banana","cherry","delta","echo","foxtrot","golf","hotel","india","juliet",
  "kilo","lima","mike","november","oscar","papa","quebec","romeo","sierra","tango",
  "uniform","victor","whiskey","xray","yankee","zulu","alpha","bravo","charlie","dog",
  "element","frost","gravity","harbor","ignite","jungle","kernel","lantern","matrix","nebula",
  "oracle","prism","quantum","raven","solar","thunder","unity","vivid","whisper","zenith",
  "cascade","drift","ember","flint","grove","haze","iris","jade","karma","lotus",
];

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "A journey of a thousand miles begins with a single step forward.",
  "Technology continues to shape how we live and work every day.",
  "The garden bloomed with vibrant colors after the spring rain.",
  "Creative thinking drives innovation in unexpected directions.",
  "The mountain trail offered breathtaking views of the valley below.",
  "Music has the power to bring people together across all cultures.",
  "The library was filled with the scent of old books and knowledge.",
  "Exploring new ideas often leads to surprising discoveries.",
  "The city skyline glowed beautifully against the evening sky.",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWords(count: number): string {
  return Array.from({ length: count }, () => randomItem(WORDS)).join(" ");
}

function generateSentences(count: number): string {
  return Array.from({ length: count }, () => randomItem(SENTENCES)).join(" ");
}

function generateParagraphs(count: number, sentencesPerPara: number): string {
  return Array.from(
    { length: count },
    () => Array.from({ length: sentencesPerPara }, () => randomItem(SENTENCES)).join(" ")
  ).join("\n\n");
}

export default function RandomTextGeneratorTool({ relatedTools, schema }: Props) {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">("words");
  const [count, setCount] = useState(10);
  const [sentencesPerPara, setSentencesPerPara] = useState(5);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    if (mode === "words") setOutput(generateWords(count));
    else if (mode === "sentences") setOutput(generateSentences(count));
    else setOutput(generateParagraphs(count, sentencesPerPara));
  }, [mode, count, sentencesPerPara]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Random Text Generator Online Free"
      subtitle="Generate random words, sentences, or paragraphs for testing."
      howToUse={[
        "Choose what to generate: words, sentences, or paragraphs.",
        "Set the count and other options as needed.",
        "Click Generate, then copy the output to your clipboard.",
      ]}
      faq={[
        { question: "What can I use random text for?", answer: "Random text is useful for testing layouts, filling design mockups, prototyping, and any time you need placeholder content." },
        { question: "Is the text truly random?", answer: "The text is pseudo-randomly selected from a predefined word/sentence bank. It's suitable for testing but not for cryptographic purposes." },
        { question: "How many words can I generate?", answer: "You can set the count to any reasonable number. The tool generates text instantly regardless of the count." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["words", "sentences", "paragraphs"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Count
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value))))}
              className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {mode === "paragraphs" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Sentences per paragraph
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={sentencesPerPara}
                onChange={(e) => setSentencesPerPara(Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          )}
          <button
            onClick={handleGenerate}
            className="btn-primary px-6 py-2.5 font-semibold cursor-pointer"
          >
            Generate
          </button>
          {output && (
            <button
              onClick={handleCopy}
              className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Output"}
            </button>
          )}
        </div>

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <pre className="max-h-96 overflow-auto font-mono text-sm text-[var(--color-foreground)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
