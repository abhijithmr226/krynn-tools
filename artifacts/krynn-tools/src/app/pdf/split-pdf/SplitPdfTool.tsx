import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropZone } from "@/components/ToolLayout";

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError("");
    setRanges("");
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Failed to read PDF. The file may be corrupted.");
      setPageCount(0);
    }
  }, []);

  const parseRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const split = async () => {
    if (!file || !ranges.trim()) {
      setError("Please enter page ranges to extract.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageIndices = parseRanges(ranges, pageCount);

      if (pageIndices.length === 0) {
        setError("No valid pages found in the specified ranges.");
        setLoading(false);
        return;
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const newBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(newBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-split.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to split PDF. Please check your page ranges and try again.");
    } finally {
      setLoading(false);
    }
  };

  const splitAll = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const indices = srcDoc.getPageIndices();

      for (const idx of indices) {
        const newDoc = await PDFDocument.create();
        const [copied] = await newDoc.copyPages(srcDoc, [idx]);
        newDoc.addPage(copied);
        const newBytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(newBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name.replace(/\.pdf$/i, "") + `-page-${idx + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      setError("Failed to split PDF into individual pages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropZone accept=".pdf" onFile={handleFile} />

      {file && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--color-foreground)]">{file.name}</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">{pageCount} pages</span>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Page Ranges
            </label>
            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              className="w-full"
            />
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              Enter page numbers or ranges separated by commas
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={split} disabled={loading || !ranges.trim()} className="btn-primary flex-1 cursor-pointer">
              {loading ? <><span className="spinner" /> Splitting...</> : "Split PDF"}
            </button>
            <button onClick={splitAll} disabled={loading} className="btn-secondary flex-1 cursor-pointer">
              {loading ? <><span className="spinner" /> Splitting...</> : "Split into Individual Pages"}
            </button>
          </div>
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
