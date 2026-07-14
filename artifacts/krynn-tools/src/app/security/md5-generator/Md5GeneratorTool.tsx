import { useState } from "react";
import CryptoJS from "crypto-js";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function Md5GeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!input) return;
    setHash(CryptoJS.MD5(input).toString());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
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
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate MD5 hash..."
            rows={4}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          />
        </div>

        <button onClick={generate} className="btn-primary mt-4 w-full cursor-pointer">
          Generate MD5
        </button>

        {hash && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">MD5 Hash</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-sm break-all text-[var(--color-foreground)]">
                {hash}
              </div>
              <button
                onClick={handleCopy}
                className="btn-secondary shrink-0 cursor-pointer px-4 py-3"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
