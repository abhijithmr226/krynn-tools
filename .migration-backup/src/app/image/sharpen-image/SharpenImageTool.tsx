"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function SharpenImageTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [amount, setAmount] = useState(1);
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
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0,
      ];

      const w = canvas.width;
      const h = canvas.height;
      const src = new Uint8ClampedArray(data);

      for (let passes = 0; passes < amount; passes++) {
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let val = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                  val += src[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                }
              }
              data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
            }
          }
        }
        if (passes < amount - 1) {
          src.set(data);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to sharpen image. Please try again.");
      setLoading(false);
    }
  }, [amount]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sharpened-${file.name}`;
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
      title="Sharpen Image Online Free"
      subtitle="Sharpen blurry images and enhance clarity. Free, instant tool."
      howToUse={[
        "Upload your image by dragging it into the drop zone.",
        "Choose the sharpening intensity (number of passes).",
        "Click Sharpen Image to process.",
        "Download your sharpened image instantly.",
      ]}
      faq={[
        {
          question: "What sharpen amount should I use?",
          answer: "Start with 1 pass for subtle sharpening. Use 2-3 passes for moderate sharpening. Higher values may introduce artifacts.",
        },
        {
          question: "Can sharpening fix very blurry photos?",
          answer: "Sharpening enhances edge contrast but cannot recover lost detail. It works best on slightly soft images, not heavily blurred ones.",
        },
        {
          question: "Is my image uploaded?",
          answer: "No. All processing happens in your browser using Canvas pixel manipulation. Your image never leaves your device.",
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

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
                Sharpen Intensity: {amount} pass{amount !== 1 ? "es" : ""}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full cursor-pointer accent-[var(--color-primary)]"
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                <span>Subtle</span>
                <span>Strong</span>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Sharpening...</span> : "Sharpen Image"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Sharpened" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">{formatSize(result.size)}</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Sharpened Image
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Sharpen Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
