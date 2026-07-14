import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function WatermarkImageTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [watermarkText, setWatermarkText] = useState("SAMPLE");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
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
    if (!imgRef.current || !watermarkText.trim()) return;
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

      const scaledFontSize = Math.max(16, fontSize * (img.naturalWidth / 800));
      ctx.font = `bold ${scaledFontSize}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
      const spacing = scaledFontSize * 4;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);

      for (let y = -diagonal; y < diagonal; y += spacing) {
        for (let x = -diagonal; x < diagonal; x += spacing * 2) {
          ctx.fillText(watermarkText, x, y);
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to add watermark. Please try again.");
      setLoading(false);
    }
  }, [watermarkText, fontSize, opacity, color]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `watermarked-${file.name}`;
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
      title="Add Watermark to Image Online Free"
      subtitle="Add text watermarks to your images. Free, customizable, and instant."
      howToUse={[
        "Upload your image by dragging it into the drop zone.",
        "Enter the watermark text and customize font size, opacity, and color.",
        "Click Add Watermark to apply.",
        "Download your watermarked image.",
      ]}
      faq={[
        {
          question: "Can I adjust the watermark opacity?",
          answer: "Yes. You can set the opacity from 10% to 100%. Lower values create a more subtle, transparent watermark.",
        },
        {
          question: "Is the watermark diagonal?",
          answer: "By default, the watermark is applied as a repeating diagonal pattern across the entire image for maximum coverage.",
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
          <FileDropZone accept=".jpg,.jpeg,.png,.webp" onFile={handleFile} />
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

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="SAMPLE"
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min={16}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded-md border border-[var(--color-border)]"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || !watermarkText.trim()} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Adding Watermark...</span> : "Add Watermark"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Watermarked" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">{formatSize(result.size)}</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Watermarked Image
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Add Another Watermark
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
