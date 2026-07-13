"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function MemeGeneratorTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|gif|webp|bmp)$/)) {
      setError("Please upload an image file (JPG, PNG, GIF, WebP, or BMP).");
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

  const drawMemeText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number,
    isTop: boolean
  ) => {
    if (!text.trim()) return;

    const scaledFontSize = Math.max(16, fontSize * (canvasWidth / 800));
    ctx.font = `900 ${scaledFontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = isTop ? "top" : "bottom";

    const x = canvasWidth / 2;
    const y = isTop ? scaledFontSize * 0.6 : canvasHeight - scaledFontSize * 0.6;
    const lines = text.split("\n");
    const lineHeight = scaledFontSize * 1.1;

    const actualY = isTop
      ? scaledFontSize * 0.6
      : canvasHeight - scaledFontSize * 0.6;

    for (let i = 0; i < lines.length; i++) {
      const lineY = isTop
        ? actualY + i * lineHeight
        : actualY - (lines.length - 1 - i) * lineHeight;

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = scaledFontSize / 8;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(lines[i], x, lineY);

      ctx.fillStyle = fontColor;
      ctx.fillText(lines[i], x, lineY);
    }
  };

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

      drawMemeText(ctx, topText, canvas.width, canvas.height, true);
      drawMemeText(ctx, bottomText, canvas.width, canvas.height, false);

      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to generate meme. Please try again.");
      setLoading(false);
    }
  }, [topText, bottomText, fontSize, fontColor]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meme-${file.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const hasText = topText.trim() || bottomText.trim();

  return (
    <ToolLayout
      title="Meme Generator Online Free"
      subtitle="Create hilarious memes by adding top and bottom text to any image."
      howToUse={[
        "Upload your image by dragging it into the drop zone.",
        "Enter top text and bottom text for your meme.",
        "Adjust font size and color to your liking.",
        "Click Generate Meme and download the result.",
      ]}
      faq={[
        {
          question: "What font style is used?",
          answer: "The meme generator uses Impact font with a thick black outline, which is the classic meme style. You can customize the fill color.",
        },
        {
          question: "Can I use multi-line text?",
          answer: "Yes! Use line breaks in the text inputs to create multi-line top or bottom text.",
        },
        {
          question: "What image formats are supported?",
          answer: "You can upload JPG, PNG, GIF, WebP, or BMP images. The output will always be a PNG file.",
        },
        {
          question: "Is my image uploaded?",
          answer: "No. All processing happens entirely in your browser using the Canvas API. Your images never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".jpg,.jpeg,.png,.gif,.webp,.bmp" onFile={handleFile} />
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
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Top Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Bottom Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Font Color</label>
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-[var(--color-border)]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || !hasText} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Generating...</span> : "Generate Meme"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Generated meme" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                PNG: {formatSize(result.size)}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Meme
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Create Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
