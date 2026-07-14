import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function HeicConverterTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [targetFormat, setTargetFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    const isHeic =
      f.name.toLowerCase().endsWith(".heic") ||
      f.name.toLowerCase().endsWith(".heif") ||
      f.type === "image/heic" ||
      f.type === "image/heif";

    if (!isHeic) {
      setError("Please upload a HEIC or HEIF image file.");
      return;
    }

    setError("");
    setFile(f);
    setResult(null);
    setResultUrl("");
    setUnsupported(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
      };
      img.onerror = () => {
        setUnsupported(true);
        setError(
          "Your browser cannot display HEIC images natively. Try opening the file in Apple Preview, then export as JPG/PNG before using this tool."
        );
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
      const ext = targetFormat === "jpeg" ? ".jpg" : ".png";

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
      setError("Failed to convert HEIC image. Please try again.");
      setLoading(false);
    }
  }, [targetFormat, quality]);

  const download = () => {
    if (!result || !file) return;
    const ext = targetFormat === "jpeg" ? ".jpg" : ".png";
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.(heic|heif)$/i, "") + ext;
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
      title="HEIC Converter Online Free"
      subtitle="Convert Apple HEIC photos to JPG or PNG for universal compatibility."
      howToUse={[
        "Upload your HEIC or HEIF image by dragging it into the drop zone.",
        "Choose your output format — JPG for smaller files, PNG for lossless quality.",
        "Click Convert to process the image.",
        "Download your converted image in your chosen format.",
      ]}
      faq={[
        {
          question: "What is a HEIC file?",
          answer: "HEIC (High Efficiency Image Container) is the default image format for iPhones and iPads running iOS 11+. It offers better compression than JPG but has limited compatibility.",
        },
        {
          question: "Why can't my browser open HEIC?",
          answer: "Not all browsers support HEIC natively. Chrome and Firefox on Windows may not display HEIC files. If the preview doesn't load, try converting on a Mac or using an online converter that handles HEIC server-side.",
        },
        {
          question: "JPG or PNG — which should I choose?",
          answer: "Choose JPG for smaller file sizes and web use. Choose PNG if you need lossless quality or transparency support.",
        },
        {
          question: "Is my photo uploaded?",
          answer: "No. All conversion happens entirely in your browser. Your photos never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".heic,.heif" onFile={handleFile} />
        )}

        {file && !result && !unsupported && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setPreview(""); setResult(null); setResultUrl(""); setError(""); setUnsupported(false); }}
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

        {error && unsupported && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
            <p className="mb-2 font-semibold text-[var(--color-foreground)]">HEIC Not Supported in This Browser</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Your browser cannot decode HEIC files directly. You can convert them on a Mac using Preview (File &gt; Export) or use a desktop HEIC converter to get JPG/PNG files first.
            </p>
          </div>
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
