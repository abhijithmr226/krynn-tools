import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const ROTATIONS = [
  { label: "90° Clockwise", value: 90 },
  { label: "180°", value: 180 },
  { label: "270° Clockwise", value: 270 },
];

export default function RotatePdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<number[]>([]);
  const [rotation, setRotation] = useState(90);
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
      const count = doc.getPageCount();
      setPageCount(count);
      setPages(Array.from({ length: count }, (_, i) => i));
    } catch {
      setError("Failed to read PDF. The file may be corrupted or password-protected.");
    }
  }, []);

  const togglePage = (idx: number) => {
    setPages((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const selectAll = () => {
    setPages(Array.from({ length: pageCount }, (_, i) => i));
  };

  const process = async () => {
    if (!file || pages.length === 0) {
      setError("Please select at least one page to rotate.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      for (const idx of pages) {
        const page = doc.getPage(idx);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotation) % 360));
      }
      const modified = await doc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to rotate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rotated-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Rotate PDF Pages Online Free"
      subtitle="Rotate PDF pages 90°, 180°, or 270° instantly. Fix page orientation for free."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Select the pages you want to rotate, or select all.",
        "Choose the rotation angle (90°, 180°, or 270°).",
        "Click Rotate and download your updated PDF.",
      ]}
      faq={[
        {
          question: "Can I rotate only specific pages?",
          answer: "Yes. After uploading, you can select individual pages or use Select All to rotate every page in the document.",
        },
        {
          question: "Does rotating reduce PDF quality?",
          answer: "No. Rotating a PDF only changes the page orientation metadata. The content and quality remain identical.",
        },
        {
          question: "Is my PDF uploaded to a server?",
          answer: "No. All processing happens in your browser using pdf-lib. Your file never leaves your device.",
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
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setResult(null); setPages([]); setPageCount(0); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">{pageCount} pages</p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--color-foreground)]">Select Pages</label>
                <button onClick={selectAll} className="cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline">
                  Select All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => togglePage(i)}
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      pages.includes(i)
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Rotation</label>
              <div className="flex flex-wrap gap-2">
                {ROTATIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRotation(r.value)}
                    className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      rotation === r.value
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || pages.length === 0} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Rotating...</span> : "Rotate Pages"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Rotated {pages.length} page{pages.length !== 1 ? "s" : ""} successfully
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Rotated PDF
            </button>
            <button onClick={() => { setResult(null); setPages(Array.from({ length: pageCount }, (_, i) => i)); }} className="btn-secondary w-full cursor-pointer">
              Rotate Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}


