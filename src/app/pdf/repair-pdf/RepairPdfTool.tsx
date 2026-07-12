"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RepairPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; repairedSize: number } | null>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
  }, []);

  const repair = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const firstSave = await doc.save();
      const reloaded = await PDFDocument.load(firstSave);
      const finalBytes = await reloaded.save();
      const blob = new Blob([new Uint8Array(finalBytes)], { type: "application/pdf" });
      setResult({
        blob,
        originalSize: file.size,
        repairedSize: blob.size,
      });
    } catch {
      setError("This PDF could not be repaired. The file may be too corrupted or use an unsupported format.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `repaired-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <ToolLayout
      title="Repair PDF Online Free"
      subtitle="Fix corrupted or damaged PDF files by re-encoding them. Free, fast, and secure."
      howToUse={[
        "Upload your corrupted or damaged PDF file.",
        "Click the Repair PDF button to re-encode the file.",
        "Download the repaired PDF if the process succeeds.",
        "If repair fails, the file may be too damaged or use an unsupported format.",
      ]}
      faq={[
        {
          question: "What types of PDF issues can this tool fix?",
          answer: "This tool can fix structural issues such as corrupted cross-reference tables, damaged object streams, and malformed headers by re-encoding the PDF with pdf-lib.",
        },
        {
          question: "Will repairing change my PDF content?",
          answer: "In most cases, no. The repair process re-encodes the PDF structure while preserving all content. However, some embedded elements may be lost if they rely on unsupported features.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All repair processing happens locally in your browser using pdf-lib. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your corrupted PDF here" />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => { setFile(null); setResult(null); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-[var(--color-destructive)] bg-red-50 px-4 py-3 text-sm text-[var(--color-destructive)]">
                {error}
              </div>
            )}

            <button onClick={repair} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Repairing...</span> : "Repair PDF"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <p className="mb-2 text-sm font-semibold text-green-700">PDF Repaired Successfully</p>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <p className="text-green-600">Original</p>
                  <p className="font-bold text-[var(--color-foreground)]">{formatSize(result.originalSize)}</p>
                </div>
                <div>
                  <p className="text-green-600">Repaired</p>
                  <p className="font-bold text-[var(--color-foreground)]">{formatSize(result.repairedSize)}</p>
                </div>
              </div>
            </div>

            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Repaired PDF
            </button>
            <button onClick={() => { setFile(null); setResult(null); setError(""); }} className="btn-secondary w-full cursor-pointer">
              Repair Another PDF
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
