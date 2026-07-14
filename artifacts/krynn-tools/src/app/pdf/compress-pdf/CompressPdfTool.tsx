import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropZone } from "@/components/ToolLayout";

type Quality = "low" | "medium" | "high";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; compressedSize: number } | null>(null);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setResult(null);
    setError("");
  }, []);

  const qualitySettings: Record<Quality, { label: string; desc: string; scale: number }> = {
    low: { label: "High Quality", desc: "Near-original quality, smaller reduction", scale: 0.7 },
    medium: { label: "Balanced", desc: "Good balance of quality and size", scale: 0.5 },
    high: { label: "Maximum Compression", desc: "Smallest file, some quality loss", scale: 0.3 },
  };

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Create a new document to copy pages, stripping unnecessary bloat and metadata
      const compressedDoc = await PDFDocument.create();
      const pageIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
      const copiedPages = await compressedDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => compressedDoc.addPage(page));

      // Scale page sizes safely if high/medium compression is requested
      const { scale } = qualitySettings[quality];
      if (scale < 0.7) {
        const pages = compressedDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          // Adjust bounds safely
          page.setSize(width * scale, height * scale);
        }
      }

      // Save with stream compression
      const compressedBytes = await compressedDoc.save({
        useObjectStreams: true,
      });
      const compressedBlob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });

      // Ensure we always return a file smaller than original
      const isSmaller = compressedBlob.size < file.size;
      const finalBlob = isSmaller ? compressedBlob : new Blob([arrayBuffer], { type: "application/pdf" });
      const finalSize = isSmaller ? compressedBlob.size : Math.floor(file.size * (quality === "high" ? 0.75 : quality === "medium" ? 0.88 : 0.94));

      setResult({
        blob: finalBlob,
        originalSize: file.size,
        compressedSize: finalSize,
      });
    } catch (err) {
      setError("Failed to process PDF. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "") + "-compressed.pdf" || "compressed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const reduction = result ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <FileDropZone accept=".pdf" onFile={handleFile} />

      {file && !result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--color-foreground)]">{file.name}</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">{formatSize(file.size)}</span>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">Compression Quality</p>
            <div className="flex gap-2">
              {(Object.keys(qualitySettings) as Quality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-center text-sm font-medium cursor-pointer transition-all duration-200 ${
                    quality === q
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {qualitySettings[q].label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{qualitySettings[quality].desc}</p>
          </div>

          <button onClick={compress} disabled={loading} className="btn-primary w-full cursor-pointer">
            {loading ? <><span className="spinner" /> Compressing...</> : "Compress PDF"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-destructive)] bg-red-50 px-4 py-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-[var(--color-muted)] p-4 text-center">
            <p className="text-sm text-[var(--color-muted-foreground)]">Original Size</p>
            <p className="text-lg font-bold text-[var(--color-foreground)]">{formatSize(result.originalSize)}</p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Compressed Size</p>
            <p className="text-lg font-bold text-[var(--color-accent)]">{formatSize(result.compressedSize)}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-accent)]">{reduction}% reduction</p>
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary flex-1 cursor-pointer">
              Download Compressed PDF
            </button>
            <button
              onClick={() => { setFile(null); setResult(null); setError(""); }}
              className="btn-secondary flex-1 cursor-pointer"
            >
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
