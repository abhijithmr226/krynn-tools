"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function RemoveBackgroundTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [threshold, setThreshold] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp|bmp)$/)) {
      setError("Please upload a JPG, PNG, WebP, or BMP image.");
      return;
    }
    setError("");
    setProcessedUrl("");
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (e) => setOriginalUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleProcess = useCallback(() => {
    if (!originalUrl) return;
    setLoading(true);
    setError("");

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Canvas not supported in your browser.");
          setLoading(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const sampleSize = 5;
        const bgColors: Array<[number, number, number]> = [];

        const sampleCorner = (sx: number, sy: number) => {
          for (let x = sx; x < sx + sampleSize && x < canvas.width; x++) {
            for (let y = sy; y < sy + sampleSize && y < canvas.height; y++) {
              const idx = (y * canvas.width + x) * 4;
              bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
            }
          }
        };

        sampleCorner(0, 0);
        sampleCorner(canvas.width - sampleSize, 0);
        sampleCorner(0, canvas.height - sampleSize);
        sampleCorner(canvas.width - sampleSize, canvas.height - sampleSize);

        const avgR = bgColors.reduce((s, c) => s + c[0], 0) / bgColors.length;
        const avgG = bgColors.reduce((s, c) => s + c[1], 0) / bgColors.length;
        const avgB = bgColors.reduce((s, c) => s + c[2], 0) / bgColors.length;

        const tol = threshold * 2.55;

        for (let i = 0; i < data.length; i += 4) {
          const dr = data[i] - avgR;
          const dg = data[i + 1] - avgG;
          const db = data[i + 2] - avgB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          if (dist < tol) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedUrl(canvas.toDataURL("image/png"));
      } catch {
        setError("Failed to process the image. Please try a different file.");
      } finally {
        setLoading(false);
      }
    };
    img.onerror = () => {
      setError("Failed to load the image.");
      setLoading(false);
    };
    img.src = originalUrl;
  }, [originalUrl, threshold]);

  const handleDownload = useCallback(() => {
    if (!processedUrl) return;
    const a = document.createElement("a");
    a.href = processedUrl;
    a.download = `${fileName}-no-bg.png`;
    a.click();
  }, [processedUrl, fileName]);

  const handleReset = () => {
    setOriginalUrl("");
    setProcessedUrl("");
    setFileName("");
    setError("");
  };

  return (
    <ToolLayout
      title={title}
      subtitle={subtitle}
      howToUse={howToUse}
      faq={faq}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!originalUrl && (
          <FileDropZone accept=".jpg,.jpeg,.png,.webp,.bmp" onFile={handleFile} label="Drag & drop your image here" />
        )}

        {originalUrl && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{fileName}</p>
              <button
                onClick={handleReset}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-200 hover:bg-[var(--color-muted)]"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Background Detection Threshold: {threshold}%
              </label>
              <input
                type="range"
                min={5}
                max={80}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full cursor-pointer accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
                <span>Strict (less removal)</span>
                <span>Loose (more removal)</span>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium text-[var(--color-muted-foreground)]">Original</p>
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full rounded-lg object-contain"
                  style={{ maxHeight: 300 }}
                />
              </div>
              {processedUrl && (
                <div>
                  <p className="mb-2 text-xs font-medium text-[var(--color-muted-foreground)]">Processed</p>
                  <div
                    className="w-full rounded-lg object-contain"
                    style={{
                      maxHeight: 300,
                      backgroundImage: "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)",
                      backgroundSize: "16px 16px",
                    }}
                  >
                    <img
                      src={processedUrl}
                      alt="Processed"
                      className="w-full rounded-lg object-contain"
                      style={{ maxHeight: 300 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <span className="spinner" />
                <span className="text-sm text-[var(--color-muted-foreground)]">Processing...</span>
              </div>
            ) : !processedUrl ? (
              <button onClick={handleProcess} className="btn-primary w-full py-2.5 font-semibold cursor-pointer">
                Remove Background
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleDownload} className="btn-primary flex-1 py-2.5 font-semibold cursor-pointer">
                  Download PNG
                </button>
                <button
                  onClick={() => setProcessedUrl("")}
                  className="btn-secondary flex-1 py-2.5 font-semibold cursor-pointer"
                >
                  Process Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
