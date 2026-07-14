import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface ResizeImageToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function ResizeImageTool({
  relatedTools,
  schema,
}: ResizeImageToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const aspectRef = useRef(1);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    setError("");
    setFile(f);
    setResizedBlob(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        aspectRef.current = img.width / img.height;
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []);

  const handleWidthChange = useCallback(
    (val: number) => {
      setWidth(val);
      if (lockAspect) {
        setHeight(Math.round(val / aspectRef.current));
      }
    },
    [lockAspect]
  );

  const handleHeightChange = useCallback(
    (val: number) => {
      setHeight(val);
      if (lockAspect) {
        setWidth(Math.round(val * aspectRef.current));
      }
    },
    [lockAspect]
  );

  const handleResize = useCallback(async () => {
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
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      setResizedBlob(blob);
    } catch {
      setError("Resize failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [preview, width, height]);

  const handleDownload = useCallback(() => {
    if (!resizedBlob || !file) return;
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resizedBlob, file]);

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ToolLayout
      title="Resize Image Online Free"
      subtitle="Resize images to any dimension. Free image resizer tool."
      howToUse={[
        "Drag and drop your image into the upload area or click to browse.",
        "Enter the desired width and height. Toggle the lock icon to maintain aspect ratio.",
        "Click the Resize button to process your image.",
        "Download your resized image in the original format.",
      ]}
      faq={[
        {
          question: "Will resizing affect image quality?",
          answer:
            "Downscaling generally maintains good quality. Upscaling may result in pixelation since new pixels are interpolated.",
        },
        {
          question: "What formats are supported?",
          answer:
            "JPEG, PNG, and WebP images are supported. The output format matches the original file type.",
        },
        {
          question: "Can I resize to exact dimensions?",
          answer:
            "Yes. Unlock the aspect ratio toggle to enter independent width and height values for exact dimensions.",
        },
        {
          question: "Is my image uploaded to a server?",
          answer:
            "No. All resizing happens in your browser using the Canvas API. Your image never leaves your device.",
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
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                  setResizedBlob(null);
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
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-foreground)]">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="accent-[var(--color-primary)]"
              />
              Lock aspect ratio
            </label>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {file && !resizedBlob && (
          <button
            onClick={handleResize}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" /> Resizing...
              </span>
            ) : (
              "Resize Image"
            )}
          </button>
        )}

        {resizedBlob && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                New size: {width} x {height} px — {formatSize(resizedBlob.size)}
              </p>
            </div>
            <button onClick={handleDownload} className="btn-primary w-full">
              Download Resized Image
            </button>
            <button
              onClick={() => setResizedBlob(null)}
              className="btn-secondary w-full"
            >
              Resize Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
