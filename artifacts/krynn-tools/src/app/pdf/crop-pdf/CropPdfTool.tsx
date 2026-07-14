import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function CropPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
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

  const applyPreset = (preset: "small" | "medium" | "large") => {
    const values = { small: 20, medium: 50, large: 80 };
    const v = values[preset];
    setTop(v);
    setRight(v);
    setBottom(v);
    setLeft(v);
  };

  const process = async () => {
    if (!file) return;
    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
      setError("Please set at least one margin value to crop.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const newWidth = width - left - right;
        const newHeight = height - top - bottom;

        if (newWidth <= 0 || newHeight <= 0) {
          setError("Crop margins are too large for one or more pages.");
          setLoading(false);
          return;
        }

        page.setMediaBox(left, bottom, newWidth, newHeight);
        page.setCropBox(left, bottom, newWidth, newHeight);
      }

      const modified = await doc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to crop PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Crop PDF Online Free"
      subtitle="Crop PDF pages by setting custom margin values to trim edges."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Set the top, right, bottom, and left margin values in points.",
        "Use the preset buttons for quick common crop sizes.",
        "Click Crop PDF and download your trimmed document.",
      ]}
      faq={[
        {
          question: "What unit are the margins measured in?",
          answer: "Margins are measured in PDF points. 1 point equals 1/72 of an inch. For reference, 72 points = 1 inch, 28.35 points = 1 centimeter.",
        },
        {
          question: "Will cropping delete the content outside the margins?",
          answer: "Cropping sets the visible area of the page. The content outside the crop area is hidden but not permanently deleted from the file.",
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
                  onClick={() => { setFile(null); setResult(null); setPageCount(0); setError(""); setTop(0); setRight(0); setBottom(0); setLeft(0); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Quick Presets</label>
              <div className="flex gap-2">
                <button onClick={() => applyPreset("small")} className="flex-1 cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200">
                  Small (20pt)
                </button>
                <button onClick={() => applyPreset("medium")} className="flex-1 cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200">
                  Medium (50pt)
                </button>
                <button onClick={() => applyPreset("large")} className="flex-1 cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200">
                  Large (80pt)
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Crop Margins (points)</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Top", value: top, set: setTop },
                  { label: "Right", value: right, set: setRight },
                  { label: "Bottom", value: bottom, set: setBottom },
                  { label: "Left", value: left, set: setLeft },
                ].map((m) => (
                  <div key={m.label}>
                    <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">{m.label}</label>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={m.value}
                      onChange={(e) => m.set(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Cropping...</span> : "Crop PDF"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Cropped all {pageCount} pages successfully
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Cropped PDF
            </button>
            <button onClick={() => { setResult(null); setError(""); }} className="btn-secondary w-full cursor-pointer">
              Crop Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
