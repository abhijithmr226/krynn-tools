"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropZone } from "@/components/ToolLayout";

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError("");
    setExtractedText("");
    setLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      const texts: string[] = [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const text = page.node?.Contents?.toString() || "";
        texts.push(`--- Page ${i + 1} ---\n${text || "(No extractable text on this page)"}`);
      }

      setExtractedText(texts.join("\n\n"));
    } catch {
      setError("Failed to extract text from PDF. The file may be scanned or corrupted.");
    } finally {
      setLoading(false);
    }
  }, []);

  const download = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, "") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = extractedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropZone accept=".pdf" onFile={handleFile} />

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-3 py-8">
          <span className="spinner" />
          <span className="text-sm text-[var(--color-muted-foreground)]">Extracting text...</span>
        </div>
      )}

      {extractedText && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
              <span className="text-sm font-medium text-[var(--color-foreground)]">Extracted Text</span>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {extractedText.split("\n").length} lines
              </span>
            </div>
            <pre className="max-h-64 overflow-auto p-4 text-sm text-[var(--color-foreground)] whitespace-pre-wrap break-words">
              {extractedText}
            </pre>
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary flex-1 cursor-pointer">
              Download as .txt
            </button>
            <button onClick={copyToClipboard} className="btn-secondary flex-1 cursor-pointer">
              Copy to Clipboard
            </button>
          </div>

          <div className="rounded-lg border border-[var(--color-warning)] bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Note:</strong> This tool extracts plain text only. For full DOCX conversion with formatting, images, and layout preserved, server-side processing would be required.
          </div>

          <button
            onClick={() => { setFile(null); setExtractedText(""); setError(""); }}
            className="btn-secondary w-full cursor-pointer"
          >
            Convert Another PDF
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-destructive)] bg-red-50 px-4 py-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}
    </div>
  );
}
