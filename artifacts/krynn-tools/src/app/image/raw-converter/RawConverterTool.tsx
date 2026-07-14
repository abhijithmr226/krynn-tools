import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RawConverterTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.toLowerCase();
    const validExts = [".cr2", ".nef", ".arw", ".dng", ".orf", ".rw2", ".pef", ".srw"];
    const isValid = validExts.some((e) => ext.endsWith(e));

    if (!isValid) {
      setError("Please upload a RAW image file (CR2, NEF, ARW, DNG, ORF, RW2, PEF, or SRW).");
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

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResult(blob);
            setResultUrl(URL.createObjectURL(blob));
          } else {
            setError("JPG conversion not supported in this browser.");
          }
          setLoading(false);
        },
        "image/jpeg",
        0.92
      );
    } catch {
      setError("Failed to convert RAW file. Please try again.");
      setLoading(false);
    }
  }, []);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, "") + ".jpg";
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
      title="RAW Converter Online Free"
      subtitle="Convert camera RAW files (CR2, NEF, ARW, DNG) to JPG format without software."
      howToUse={[
        "Upload your RAW camera file (CR2, NEF, ARW, DNG, etc.) into the drop zone.",
        "Click Convert to JPG to process the image.",
        "Preview the result and download your JPG file.",
        "Note: Only basic RAW decoding is supported in the browser.",
      ]}
      faq={[
        {
          question: "What are RAW files?",
          answer: "RAW files are unprocessed image data directly from a camera sensor. They contain more detail than JPG but are much larger and require specific software to view.",
        },
        {
          question: "Which RAW formats are supported?",
          answer: "We accept CR2 (Canon), NEF (Nikon), ARW (Sony), DNG (Adobe), ORF (Olympus), RW2 (Panasonic), PEF (Pentax), and SRW (Samsung).",
        },
        {
          question: "Why won't my RAW file load?",
          answer: "Browsers have very limited native RAW support. Most RAW files cannot be decoded by the browser. For best results, use a desktop tool like Adobe Lightroom, RawTherapee, or darktable.",
        },
        {
          question: "Is my file uploaded?",
          answer: "No. All conversion attempts happen in your browser. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".cr2,.nef,.arw,.dng,.orf,.rw2,.pef,.srw" onFile={handleFile} />
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
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 rounded-md object-contain" />
                ) : (
                  <p className="text-sm text-[var(--color-muted-foreground)]">Loading preview...</p>
                )}
              </div>
              <p className="mt-2 text-center text-sm text-[var(--color-muted-foreground)]">
                Original: {formatSize(file.size)}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Output format: <span className="font-semibold text-[var(--color-foreground)]">JPG</span> at 92% quality
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to JPG"}
            </button>
          </>
        )}

        {unsupported && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
            <p className="mb-2 font-semibold text-[var(--color-foreground)]">RAW File Not Supported in This Browser</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Your browser cannot decode this RAW file. Try converting it using Adobe Lightroom, RawTherapee, darktable, or your camera manufacturer&apos;s software to get JPG files first.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="JPG result" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                JPG: {formatSize(result.size)}
                {file && ` (was ${formatSize(file.size)})`}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download JPG
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
