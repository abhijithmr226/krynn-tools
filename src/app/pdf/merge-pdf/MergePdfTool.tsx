"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

interface PdfFile {
  file: File;
  name: string;
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) {
      setError("Please upload PDF files only.");
      return;
    }
    setFiles((prev) => [...prev, ...pdfFiles.map((f) => ({ file: f, name: f.name }))]);
    setError("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const merge = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to merge PDFs. One or more files may be corrupted or password-protected.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="tool-card">
      <div
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        className="drop-zone"
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="merge-upload"
        />
        <label htmlFor="merge-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
              <svg className="h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--color-foreground)]">
                Drag & drop multiple PDF files here
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">or click to browse</p>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Supports: PDF files</p>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-[var(--color-foreground)]">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--color-primary)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{f.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{formatSize(f.file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveFile(i, "up")}
                  disabled={i === 0}
                  className="rounded p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                  title="Move up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveFile(i, "down")}
                  disabled={i === files.length - 1}
                  className="rounded p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                  title="Move down"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => removeFile(i)}
                  className="rounded p-1.5 text-[var(--color-destructive)] hover:bg-red-50 cursor-pointer transition-colors duration-200"
                  title="Remove"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button onClick={merge} disabled={loading || files.length < 2} className="btn-primary w-full cursor-pointer">
            {loading ? <><span className="spinner" /> Merging...</> : "Merge PDF Files"}
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
