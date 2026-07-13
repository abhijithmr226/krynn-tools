"use client";

import { useState, useCallback } from "react";
import { FileDropZone, ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface Hashes {
  md5: string;
  sha256: string;
  sha512: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function FileChecksumCalculatorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const computeHash = async (algorithm: string, data: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return bufferToHex(hashBuffer);
  };

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setHashes(null);
    setFileName(file.name);
    setCopiedField(null);

    try {
      const buffer = await file.arrayBuffer();
      const [md5, sha256, sha512] = await Promise.all([
        computeHash("MD5", buffer).catch(() => "N/A (browser limitation)"),
        computeHash("SHA-256", buffer),
        computeHash("SHA-512", buffer),
      ]);
      setHashes({ md5, sha256, sha512 });
    } catch {
      setHashes({ md5: "Error", sha256: "Error", sha512: "Error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hashEntries = hashes
    ? [
        { label: "MD5", value: hashes.md5, field: "md5" },
        { label: "SHA-256", value: hashes.sha256, field: "sha256" },
        { label: "SHA-512", value: hashes.sha512, field: "sha512" },
      ]
    : [];

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
        <FileDropZone
          accept="*"
          onFile={handleFile}
          label="Drop a file here to calculate checksums"
        />

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="spinner" />
            <span className="text-sm text-[var(--color-muted-foreground)]">Calculating checksums...</span>
          </div>
        )}

        {hashes && (
          <div className="mt-6 space-y-3">
            <div className="text-sm font-medium text-[var(--color-foreground)]">
              Checksums for: <span className="text-[var(--color-primary)]">{fileName}</span>
            </div>
            {hashEntries.map(({ label, value, field }) => (
              <div key={field}>
                <div className="mb-1 text-xs font-medium text-[var(--color-muted-foreground)]">{label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-xs break-all text-[var(--color-foreground)]">
                    {value}
                  </div>
                  <button
                    onClick={() => handleCopy(value, field)}
                    className="shrink-0 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] cursor-pointer"
                  >
                    {copiedField === field ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
