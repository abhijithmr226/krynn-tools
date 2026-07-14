import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface CompressImageToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function CompressImageTool({
  relatedTools,
  schema,
}: CompressImageToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [quality, setQuality] = useState(70);
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    setError("");
    setFile(f);
    setOriginalSize(f.size);
    setCompressed(null);
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality / 100,
      };
      const result = await imageCompression(file, options);
      setCompressed(result);
      setCompressedSize(result.size);
    } catch {
      setError("Compression failed. Try a different quality setting.");
    } finally {
      setLoading(false);
    }
  }, [file, quality]);

  const handleDownload = useCallback(() => {
    if (!compressed || !file) return;
    const ext = file.type.split("/")[1];
    const url = URL.createObjectURL(compressed);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [compressed, file]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const reduction = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <ToolLayout
      title="Compress Image Online Free"
      subtitle="Compress JPEG, PNG, and WebP images without losing quality."
      howToUse={[
        "Drag and drop your image into the upload area or click to browse.",
        "Adjust the quality slider to set your desired compression level.",
        "Click the Compress button and wait a moment for processing.",
        "Download your compressed image with reduced file size.",
      ]}
      faq={[
        {
          question: "Does compression reduce image quality?",
          answer:
            "Minimal quality loss occurs at high quality settings (80-100). Most images look identical at 70-80 quality but with significantly smaller file sizes.",
        },
        {
          question: "What image formats are supported?",
          answer:
            "This tool supports JPEG, PNG, and WebP image formats. All compression happens in your browser — files are never uploaded to a server.",
        },
        {
          question: "What is a good quality setting?",
          answer:
            "A quality of 70-80 provides a great balance between file size and visual quality. Use 90+ for photos where quality is critical.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "There is no strict limit, but very large files (over 50MB) may take longer to compress. The tool works entirely in your browser.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && <FileDropZone accept=".jpg,.jpeg,.png,.webp" onFile={handleFile} />}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {formatSize(originalSize)}
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                  setCompressed(null);
                  setCompressedSize(0);
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

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mb-2 w-full cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {file && !compressed && (
          <button
            onClick={handleCompress}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" /> Compressing...
              </span>
            ) : (
              "Compress Image"
            )}
          </button>
        )}

        {compressed && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Original</p>
                  <p className="font-bold text-[var(--color-foreground)]">
                    {formatSize(originalSize)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Compressed</p>
                  <p className="font-bold text-[var(--color-foreground)]">
                    {formatSize(compressedSize)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Reduction</p>
                  <p className="font-bold text-[var(--color-accent)]">{reduction}%</p>
                </div>
              </div>
            </div>
            <button onClick={handleDownload} className="btn-primary w-full">
              Download Compressed Image
            </button>
            <button
              onClick={() => {
                setCompressed(null);
                setCompressedSize(0);
              }}
              className="btn-secondary w-full"
            >
              Compress Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
