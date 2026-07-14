import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function PsdConverterTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".psd")) {
      setError("Please upload a PSD (Photoshop) file.");
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

      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        } else {
          setError("PNG conversion not supported in this browser.");
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to convert PSD file. Please try again.");
      setLoading(false);
    }
  }, []);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.psd$/i, "") + ".png";
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
      title="PSD Converter Online Free"
      subtitle="Convert Photoshop PSD files to PNG without Photoshop installed."
      howToUse={[
        "Upload your PSD file by dragging it into the drop zone.",
        "Click Convert to PNG to process the file.",
        "Preview the result and download your PNG file.",
        "Note: Complex PSDs with many layers may only show a flattened result.",
      ]}
      faq={[
        {
          question: "What is a PSD file?",
          answer: "PSD (Photoshop Document) is Adobe Photoshop's native file format. It supports layers, masks, transparency, and other advanced features.",
        },
        {
          question: "Will layers be preserved?",
          answer: "No. Browser-based conversion flattens all layers into a single image. Only a rasterized preview of the PSD is exported.",
        },
        {
          question: "Why won't my PSD load?",
          answer: "Browsers have limited native PSD support. Some PSD files, especially those with uncommon bit depths or features, may not be decodable. Try exporting from Photoshop or GIMP first.",
        },
        {
          question: "Is my file uploaded?",
          answer: "No. All conversion happens in your browser. Your PSD files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".psd" onFile={handleFile} />
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

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Output format: <span className="font-semibold text-[var(--color-foreground)]">PNG</span> (lossless, supports transparency)
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to PNG"}
            </button>
          </>
        )}

        {unsupported && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
            <p className="mb-2 font-semibold text-[var(--color-foreground)]">PSD Not Supported in This Browser</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Your browser cannot decode this PSD file natively. Try opening it in Adobe Photoshop, GIMP, or Photopea and exporting as PNG or JPG first.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="PNG result" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                PNG: {formatSize(result.size)}
                {file && ` (was ${formatSize(file.size)})`}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download PNG
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
