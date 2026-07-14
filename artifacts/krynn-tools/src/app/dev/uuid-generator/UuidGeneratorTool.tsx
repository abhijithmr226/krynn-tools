import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function UuidGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUuids = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(crypto.randomUUID());
    }
    setUuids(result);
    setCopiedIdx(null);
    setCopiedAll(false);
  };

  const copyUuid = async (uuid: string, idx: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[140px]">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Count (1–100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => {
                const v = Math.min(100, Math.max(1, Number(e.target.value) || 1));
                setCount(v);
              }}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Version
            </label>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-2.5 text-sm text-[var(--color-muted-foreground)]">
              v4 (Random)
            </div>
          </div>
          <button
            onClick={generateUuids}
            className="btn-primary px-8 py-2.5 font-semibold cursor-pointer"
          >
            Generate
          </button>
          {uuids.length > 0 && (
            <button
              onClick={copyAll}
              className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer"
            >
              {copiedAll ? "Copied All!" : "Copy All"}
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="mt-6 space-y-2">
            {uuids.map((uuid, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
              >
                <code className="font-mono text-sm text-[var(--color-foreground)] select-all">
                  {uuid}
                </code>
                <button
                  onClick={() => copyUuid(uuid, idx)}
                  className="ml-4 shrink-0 text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
