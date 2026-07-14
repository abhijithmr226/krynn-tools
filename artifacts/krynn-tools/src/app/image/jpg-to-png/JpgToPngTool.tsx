import { useState, useCallback } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface JpgToPngToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function JpgToPngTool({
  relatedTools,
  schema,
}: JpgToPngToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|jpg)$/)) {
      setError("Please upload a JPG or JPEG image.");
      return;
    }
    setError("");
    setFile(f);
    setResultBlob(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = preview;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      setResultBlob(blob);
    } catch {
      setError("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [preview]);

  const handleDownload = useCallback(() => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.(jpg|jpeg)$/i, "") + ".png";
    a.click();
    URL.revokeObjectURL(url);
  }, [resultBlob, file]);

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ToolLayout
      title="JPG to PNG Converter Free"
      subtitle="Convert JPG images to PNG format with transparent backgrounds."
      howToUse={[
        "Drag and drop your JPG image into the upload area or click to browse.",
        "Click the Convert button to start the conversion instantly.",
        "Download your converted PNG file with a single click.",
      ]}
      faq={[
        {
          question: "Why convert JPG to PNG?",
          answer:
            "PNG supports lossless compression and transparency. Converting to PNG is useful when you need higher quality or transparency support.",
        },
        {
          question: "Does JPG have transparency?",
          answer:
            "No. JPG does not support transparency. The converted PNG will have the same visual content but without any transparency.",
        },
        {
          question: "Is the file uploaded to a server?",
          answer:
            "No. All conversion happens in your browser using the Canvas API. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".jpg,.jpeg" onFile={handleFile} />
        )}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                  setResultBlob(null);
                  setError("");
                }}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-destructive)] transition-colors duration-200 hover:bg-[var(--color-muted)]"
              >
                Remove
              </button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 rounded-md object-contain"
              />
            )}
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {file && !resultBlob && (
          <button
            onClick={handleConvert}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" /> Converting...
              </span>
            ) : (
              "Convert to PNG"
            )}
          </button>
        )}

        {resultBlob && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                PNG file ready — {formatSize(resultBlob.size)}
              </p>
            </div>
            <button onClick={handleDownload} className="btn-primary w-full">
              Download PNG
            </button>
            <button
              onClick={() => setResultBlob(null)}
              className="btn-secondary w-full"
            >
              Convert Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
