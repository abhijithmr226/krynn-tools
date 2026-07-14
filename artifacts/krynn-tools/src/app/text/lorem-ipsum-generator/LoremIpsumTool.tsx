import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface LoremIpsumToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "ratione", "sequi", "nesciunt",
  "neque", "porro", "quisquam", "nihil", "impedit", "quo", "minus", "maxime",
  "placeat", "facere", "possimus", "omnis", "voluptas", "assumenda", "repellendus",
];

function generateParagraph(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

export default function LoremIpsumTool({
  relatedTools,
  schema,
}: LoremIpsumToolProps) {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const result: string[] = [];
    for (let i = 0; i < paragraphs; i++) {
      result.push(generateParagraph(wordsPerParagraph));
    }
    setOutput(result.join("\n\n"));
  }, [paragraphs, wordsPerParagraph]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lorem-ipsum.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  return (
    <ToolLayout
      title="Lorem Ipsum Generator Free"
      subtitle="Generate placeholder text for design mockups. Custom paragraph count."
      howToUse={[
        "Set the number of paragraphs and words per paragraph using the controls.",
        "Click the Generate button to create your placeholder text.",
        "Copy the text to your clipboard or download it as a file.",
      ]}
      faq={[
        {
          question: "What is Lorem Ipsum?",
          answer:
            "Lorem Ipsum is dummy text used as placeholder content in design and publishing. It has been the industry standard since the 1500s.",
        },
        {
          question: "How many paragraphs can I generate?",
          answer:
            "You can generate between 1 and 50 paragraphs, with each paragraph containing up to 200 words.",
        },
        {
          question: "Is this random each time?",
          answer:
            "Yes. Each generation picks random words from the traditional Lorem Ipsum word pool, so the output varies each time.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
              Paragraphs: {paragraphs}
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={paragraphs}
              onChange={(e) => setParagraphs(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>1</span>
              <span>50</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
              Words per paragraph: {wordsPerParagraph}
            </label>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={wordsPerParagraph}
              onChange={(e) => setWordsPerParagraph(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>10</span>
              <span>200</span>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn-primary w-full">
          Generate Lorem Ipsum
        </button>

        {output && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-[var(--color-muted-foreground)]">
                Generated Text
              </p>
              <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md bg-[var(--color-muted)] p-4 text-sm leading-relaxed text-[var(--color-foreground)]">
                {output}
              </pre>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCopy} className="btn-primary flex-1">
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button onClick={handleDownload} className="btn-secondary flex-1">
                Download .txt
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
