import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function DeletePdfPagesTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
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
    setSelected([]);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Failed to read PDF. The file may be corrupted.");
    }
  }, []);

  const togglePage = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const process = async () => {
    if (!file || selected.length === 0) {
      setError("Please select at least one page to delete.");
      return;
    }
    if (selected.length === pageCount) {
      setError("You cannot delete all pages. Keep at least one page.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const sorted = [...selected].sort((a, b) => b - a);
      for (const idx of sorted) {
        doc.removePage(idx);
      }
      const modified = await doc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to delete pages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trimmed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Delete PDF Pages Online Free"
      subtitle="Remove specific pages from a PDF document. Free, fast, and secure."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Click on the page numbers you want to delete.",
        "Click the Delete Pages button to remove them.",
        "Download your updated PDF instantly.",
      ]}
      faq={[
        {
          question: "Can I delete multiple pages at once?",
          answer: "Yes. You can select as many pages as you want to delete in a single operation.",
        },
        {
          question: "Can I delete all pages?",
          answer: "No. You must keep at least one page in the PDF. Select all but one if you want to keep only a single page.",
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
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setResult(null); setSelected([]); setPageCount(0); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {pageCount} pages — click pages below to mark for deletion
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
                Select Pages to Delete ({selected.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => togglePage(i)}
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      selected.includes(i)
                        ? "bg-red-500 text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || selected.length === 0} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Deleting...</span> : `Delete ${selected.length} Page${selected.length !== 1 ? "s" : ""}`}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Deleted {selected.length} page{selected.length !== 1 ? "s" : ""} — {pageCount - selected.length} pages remaining
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download PDF
            </button>
            <button onClick={() => { setResult(null); setSelected([]); }} className="btn-secondary w-full cursor-pointer">
              Delete More Pages
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
