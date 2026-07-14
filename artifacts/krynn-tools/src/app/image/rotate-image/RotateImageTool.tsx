import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const ROTATIONS = [
  { label: "90° Right", value: 90 },
  { label: "180°", value: 180 },
  { label: "270° Left", value: 270 },
];

export default function RotateImageTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [rotation, setRotation] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
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
      const rad = (rotation * Math.PI) / 180;
      const isVertical = rotation === 90 || rotation === 270;
      const w = isVertical ? img.naturalHeight : img.naturalWidth;
      const h = isVertical ? img.naturalWidth : img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.translate(w / 2, h / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to rotate image. Please try again.");
      setLoading(false);
    }
  }, [rotation]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rotated-${file.name}`;
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
      title="Rotate Image Online Free"
      subtitle="Rotate images 90°, 180°, or 270° instantly. No upload needed."
      howToUse={[
        "Upload your image by dragging it into the drop zone.",
        "Choose the rotation angle (90°, 180°, or 270°).",
        "Click Rotate Image to process.",
        "Download your rotated image instantly.",
      ]}
      faq={[
        {
          question: "What image formats are supported?",
          answer: "The tool supports JPG, PNG, WebP, and GIF images for rotation.",
        },
        {
          question: "Does rotating reduce image quality?",
          answer: "No. Rotating an image simply changes its orientation. The pixel data remains unchanged and quality is preserved.",
        },
        {
          question: "Is my image uploaded?",
          answer: "No. All processing happens in your browser using the Canvas API. Your image never leaves your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".jpg,.jpeg,.png,.webp,.gif" onFile={handleFile} />
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
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Rotation Angle</label>
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

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Rotating...</span> : "Rotate Image"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Rotated" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">{formatSize(result.size)}</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Rotated Image
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Rotate Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
