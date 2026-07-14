import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
type Format = "number" | "page" | "page-of-total";

const POSITIONS: { label: string; value: Position }[] = [
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Top Left", value: "top-left" },
];

const FORMATS: { label: string; value: Format; example: string }[] = [
  { label: "Number Only", value: "number", example: "1, 2, 3..." },
  { label: "Page Label", value: "page", example: "Page 1, Page 2..." },
  { label: "Page of Total", value: "page-of-total", example: "Page 1 of 5" },
];

export default function AddPageNumbersTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("number");
  const [fontSize, setFontSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

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
      setPageCount(doc.getPageCount());
    } catch {
      setError("Failed to read PDF. The file may be corrupted.");
    }
  }, []);

  const formatPageNumber = (num: number, total: number): string => {
    switch (format) {
      case "number":
        return `${num}`;
      case "page":
        return `Page ${num}`;
      case "page-of-total":
        return `Page ${num} of ${total}`;
    }
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      const total = pages.length;

      for (let i = 0; i < total; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = formatPageNumber(i + 1, total);
        const textWidth = text.length * fontSize * 0.5;
        const margin = 30;

        let x: number;
        let y: number;

        switch (position) {
          case "bottom-center":
            x = (width - textWidth) / 2;
            y = margin;
            break;
          case "bottom-right":
            x = width - textWidth - margin;
            y = margin;
            break;
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "top-center":
            x = (width - textWidth) / 2;
            y = height - margin - fontSize;
            break;
          case "top-right":
            x = width - textWidth - margin;
            y = height - margin - fontSize;
            break;
          case "top-left":
            x = margin;
            y = height - margin - fontSize;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
        });
      }

      const modified = await doc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to add page numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `numbered-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Add Page Numbers to PDF Online Free"
      subtitle="Insert page numbers into every page of your PDF with custom position and style."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Choose where to place the page numbers (top or bottom, left, center, or right).",
        "Select the number format and adjust the font size.",
        "Click Add Page Numbers and download your updated PDF.",
      ]}
      faq={[
        {
          question: "Can I choose where the page numbers appear?",
          answer: "Yes. You can place page numbers at the top or bottom of each page, aligned to the left, center, or right.",
        },
        {
          question: "What number formats are available?",
          answer: "You can choose from simple numbers (1, 2, 3), page labels (Page 1, Page 2), or page-of-total format (Page 1 of 5).",
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
                <button
                  onClick={() => { setFile(null); setResult(null); setPageCount(0); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {POSITIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPosition(p.value)}
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      position === p.value
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Number Format</label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`w-full cursor-pointer rounded-md px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                      format === f.value
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="ml-2 text-xs opacity-70">({f.example})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
                Font Size: {fontSize}pt
              </label>
              <input
                type="range"
                min={8}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                <span>8pt</span>
                <span>24pt</span>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Adding Numbers...</span> : "Add Page Numbers"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Added page numbers to {pageCount} pages successfully
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Numbered PDF
            </button>
            <button onClick={() => { setResult(null); setError(""); }} className="btn-secondary w-full cursor-pointer">
              Number Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
