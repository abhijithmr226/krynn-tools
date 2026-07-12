"use client";

import { useState, useCallback, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RearrangePdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i));
    } catch {
      setError("Failed to read PDF. The file may be corrupted or password-protected.");
    }
  }, []);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...order];
    const draggedItem = newOrder.splice(dragItem.current, 1)[0];
    newOrder.splice(dragOverItem.current, 0, draggedItem);
    setOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const newOrder = [...order];
    const [item] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, item);
    setOrder(newOrder);
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, order);
      copiedPages.forEach((page) => newDoc.addPage(page));
      const modified = await newDoc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to rearrange PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rearranged-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Rearrange PDF Pages Online Free"
      subtitle="Drag and drop to reorder PDF pages in any sequence you want."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Drag pages to reorder them, or use the arrow buttons.",
        "Click Rearrange Pages to apply the new order.",
        "Download your rearranged PDF instantly.",
      ]}
      faq={[
        {
          question: "How do I reorder pages?",
          answer: "You can drag and drop pages to their new position, or use the up/down arrow buttons next to each page to move them one step at a time.",
        },
        {
          question: "Can I reverse the page order?",
          answer: "Yes. Click the reverse button to flip the entire page order, or manually drag each page to its desired position.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All processing happens locally in your browser using pdf-lib. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your PDF here" />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{pageCount} pages</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrder((prev) => [...prev].reverse())}
                    className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Reverse
                  </button>
                  <button
                    onClick={() => { setFile(null); setResult(null); setOrder([]); setPageCount(0); setError(""); }}
                    className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
                Page Order (drag to reorder)
              </label>
              <div className="space-y-2">
                {order.map((originalIndex, pos) => (
                  <div
                    key={`${originalIndex}-${pos}`}
                    draggable
                    onDragStart={() => handleDragStart(pos)}
                    onDragEnter={() => handleDragEnter(pos)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 transition-colors duration-200 hover:border-[var(--color-primary)] cursor-grab active:cursor-grabbing ${
                      dragItem.current === pos ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-[var(--color-muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-foreground)]">
                        Position {pos + 1}
                      </span>
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        (Page {originalIndex + 1})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(pos, pos - 1)}
                        disabled={pos === 0}
                        className="rounded p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                        title="Move up"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveItem(pos, pos + 1)}
                        disabled={pos === order.length - 1}
                        className="rounded p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                        title="Move down"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Rearranging...</span> : "Rearrange Pages"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Pages rearranged successfully
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Rearranged PDF
            </button>
            <button onClick={() => { setResult(null); setOrder(Array.from({ length: pageCount }, (_, i) => i)); }} className="btn-secondary w-full cursor-pointer">
              Rearrange Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
