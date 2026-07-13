"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface PageImage {
  dataUrl: string;
  index: number;
}

export default function PdfToJpgTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const renderPdfPageToImage = (pdfUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      const img = new Image();
      img.onload = () => {
        const scale = 2;
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => reject(new Error("Failed to render page"));
      img.src = pdfUrl;
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setLoading(true);
    setPages([]);
    setFileName(file.name.replace(/\.pdf$/i, ""));

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      const result: PageImage[] = [];

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();

        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const img = await renderPdfPageToImage(url);
        URL.revokeObjectURL(url);
        result.push({ dataUrl: img, index: i });
      }

      setPages(result);
    } catch {
      setError("Failed to process the PDF. Please try a different file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadAll = useCallback(() => {
    pages.forEach((page, i) => {
      const a = document.createElement("a");
      a.href = page.dataUrl;
      a.download = `${fileName}-page-${i + 1}.jpg`;
      a.click();
    });
  }, [pages, fileName]);

  const handleDownloadSingle = useCallback((page: PageImage) => {
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = `${fileName}-page-${page.index + 1}.jpg`;
    a.click();
  }, [fileName]);

  const handleReset = () => {
    setPages([]);
    setError("");
    setFileName("");
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
      <div className="space-y-6">
        {!pages.length && !loading && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your PDF here" />
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-12">
            <span className="spinner" />
            <p className="text-sm text-[var(--color-muted-foreground)]">Processing PDF pages...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {pages.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="font-semibold text-[var(--color-foreground)] break-all">
                {fileName}.pdf — {pages.length} page{pages.length > 1 ? "s" : ""} converted
              </p>
              <button onClick={handleReset} className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-200 hover:bg-[var(--color-muted)] self-end sm:self-auto">
                Remove
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pages.map((page) => (
                <div key={page.index} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.index + 1}`}
                    className="mb-3 w-full rounded-md object-contain"
                    style={{ maxHeight: 300 }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-muted-foreground)]">Page {page.index + 1}</span>
                    <button
                      onClick={() => handleDownloadSingle(page)}
                      className="cursor-pointer rounded-md bg-[var(--color-muted)] px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors duration-200 hover:bg-[var(--color-border)]"
                    >
                      Download JPG
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleDownloadAll} className="btn-primary w-full py-3 cursor-pointer">
              Download All as JPG
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
