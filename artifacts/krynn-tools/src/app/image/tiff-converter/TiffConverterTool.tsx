import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function TiffConverterTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [targetFormat, setTargetFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.toLowerCase();
    if (!ext.endsWith(".tiff") && !ext.endsWith(".tif")) {
      setError("Please upload a TIFF or TIF image file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
    setResultUrl("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      const img = new Image();
      img.onload = () => { imgRef.current = img; };
      img.onerror = () => {
        setError("Your browser could not decode this TIFF file. It may use compression that is not supported natively.");
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []);

  const process = useCallback(() => {
    if (!imgRef.current) return;
    setLoading(true);
    setError("");
    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === "jpeg" ? "image/jpeg" : "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResult(blob);
            setResultUrl(URL.createObjectURL(blob));
          } else {
            setError("Conversion not supported in this browser.");
          }
          setLoading(false);
        },
        mimeType,
        targetFormat === "jpeg" ? quality / 100 : undefined
      );
    } catch {
      setError("Failed to convert TIFF image. Please try again.");
      setLoading(false);
    }
  }, [targetFormat, quality]);

  const download = () => {
    if (!result || !file) return;
    const ext = targetFormat === "jpeg" ? ".jpg" : ".png";
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.(tiff|tif)$/i, "") + ext;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <ToolLayout
      title="TIFF Converter Online Free"
      subtitle="Convert TIFF images to JPG or PNG format with quality controls."
      howToUse={[
        "Upload your TIFF or TIF image into the drop zone.",
        "Select your output format — JPG for smaller files, PNG for lossless quality.",
        "Adjust the quality slider if converting to JPG.",
        "Click Convert and download your file.",
      ]}
      faq={[
        {
          question: "What is a TIFF file?",
          answer: "TIFF (Tagged Image File Format) is a high-quality image format used in professional photography, printing, and scanning. TIFF files can be quite large.",
        },
        {
          question: "Why is my TIFF not loading?",
          answer: "Some TIFF files use compression algorithms (like LZW or JPEG compression within TIFF) that browsers cannot decode natively. In that case, try converting with a desktop app first.",
        },
        {
          question: "JPG or PNG — which should I choose?",
          answer: "Choose JPG for smaller file sizes and general use. Choose PNG for lossless quality or if you need transparency.",
        },
        {
          question: "Is my file uploaded?",
          answer: "No. All conversion happens in your browser using the Canvas API. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".tiff,.tif" onFile={handleFile} />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setPreview(""); setResult(null); setResultUrl(""); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-center">
                <img src={preview} alt="Preview" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-2 text-center text-sm text-[var(--color-muted-foreground)]">
                Original: {formatSize(file.size)}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Output Format</label>
                <div className="flex gap-2">
                  {(["jpeg", "png"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`cursor-pointer flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 uppercase ${
                        targetFormat === fmt
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat === "jpeg" && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[var(--color-primary)]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                    <span>Smaller file</span>
                    <span>Higher quality</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : `Convert to ${targetFormat.toUpperCase()}`}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Converted" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                {targetFormat.toUpperCase()}: {formatSize(result.size)}
                {file && ` (was ${formatSize(file.size)})`}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download {targetFormat.toUpperCase()}
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Convert Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
