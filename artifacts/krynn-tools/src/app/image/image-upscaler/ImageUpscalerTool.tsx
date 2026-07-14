import { useState, useCallback, useRef } from "react";
import { FileDropZone } from "@/components/ToolLayout";

type UpscaleFactor = 2 | 3 | 4;
type OutputFormat = "png" | "jpg";

export default function ImageUpscalerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [factor, setFactor] = useState<UpscaleFactor>(2);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90);
  const [sharpen, setSharpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    w: number;
    h: number;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const upscale = useCallback(async () => {
    if (!imgRef.current) return;
    setLoading(true);
    setError("");
    try {
      const img = imgRef.current;
      const targetW = img.naturalWidth * factor;
      const targetH = img.naturalHeight * factor;

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);

      if (sharpen) {
        const blurRadius = Math.max(1, Math.round(factor * 0.8));

        const origData = ctx.getImageData(0, 0, targetW, targetH);

        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = targetW;
        blurCanvas.height = targetH;
        const blurCtx = blurCanvas.getContext("2d");
        if (!blurCtx) throw new Error("Canvas not supported");
        blurCtx.filter = `blur(${blurRadius}px)`;
        blurCtx.drawImage(canvas, 0, 0);
        const blurData = blurCtx.getImageData(0, 0, targetW, targetH);

        const orig = origData.data;
        const blur = blurData.data;
        const amount = 0.6;

        for (let i = 0; i < orig.length; i += 4) {
          orig[i] = Math.min(255, Math.max(0, orig[i] + (orig[i] - blur[i]) * amount));
          orig[i + 1] = Math.min(255, Math.max(0, orig[i + 1] + (orig[i + 1] - blur[i + 1]) * amount));
          orig[i + 2] = Math.min(255, Math.max(0, orig[i + 2] + (orig[i + 2] - blur[i + 2]) * amount));
        }

        ctx.putImageData(origData, 0, 0);
      }

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to create blob"));
          },
          mimeType,
          format === "jpg" ? quality / 100 : undefined
        );
      });

      const url = URL.createObjectURL(blob);
      setResult({ blob, url, w: targetW, h: targetH });
    } catch {
      setError("Failed to upscale image. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [factor, format, quality, sharpen]);

  const download = useCallback(() => {
    if (!result || !file) return;
    const ext = format === "jpg" ? "jpg" : "png";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${baseName}-${factor}x.${ext}`;
    a.click();
  }, [result, file, format, factor]);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreview("");
    setOriginalDims({ w: 0, h: 0 });
    setResult(null);
    setError("");
    imgRef.current = null;
  }, [result]);

  return (
    <div className="space-y-6">
      {!file && <FileDropZone accept=".jpg,.jpeg,.png,.webp" onFile={handleFile} />}

      {file && !result && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={reset}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-200 hover:text-[var(--color-foreground)]"
              >
                Remove
              </button>
            </div>
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-md object-contain"
                />
              </div>
            )}
            <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
              {originalDims.w} x {originalDims.h} px — {formatSize(file.size)}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Upscale Factor
            </p>
            <div className="flex gap-2">
              {([2, 3, 4] as UpscaleFactor[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFactor(f)}
                  className={`flex-1 cursor-pointer rounded-lg border-2 px-3 py-2 text-center text-sm font-medium transition-all duration-200 ${
                    factor === f
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {f}x
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
              Output: {originalDims.w * factor} x {originalDims.h * factor} px
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Output Format
            </p>
            <div className="flex gap-2">
              {(["png", "jpg"] as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 cursor-pointer rounded-lg border-2 px-3 py-2 text-center text-sm font-medium uppercase transition-all duration-200 ${
                    format === f
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {format === "jpg" && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min={50}
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

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={sharpen}
                  onChange={(e) => setSharpen(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-[var(--color-muted)] transition-colors duration-200 peer-checked:bg-[var(--color-primary)]" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                Sharpen (Unsharp Mask)
              </span>
            </label>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              Enhances edge contrast for a crisper result after upscaling.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-[var(--color-destructive)] bg-red-50 px-4 py-3 text-sm text-[var(--color-destructive)]">
              {error}
            </div>
          )}

          <button
            onClick={upscale}
            disabled={loading}
            className="btn-primary w-full cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" /> Upscaling...
              </span>
            ) : (
              `Upscale Image ${factor}x`
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex justify-center">
              <img
                src={result.url}
                alt="Upscaled"
                className="max-h-64 rounded-md object-contain"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xs text-[var(--color-muted-foreground)]">Original</p>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {originalDims.w} x {originalDims.h}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {formatSize(file!.size)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-muted-foreground)]">Upscaled</p>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {result.w} x {result.h}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {formatSize(result.blob.size)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-primary flex-1 cursor-pointer">
              Download Upscaled Image
            </button>
            <button onClick={reset} className="btn-secondary flex-1 cursor-pointer">
              Upscale Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
