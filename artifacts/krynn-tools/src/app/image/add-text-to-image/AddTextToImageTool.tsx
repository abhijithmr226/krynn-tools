import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function AddTextToImageTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("Your Text Here");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [showBg, setShowBg] = useState(false);
  const [position, setPosition] = useState<"center" | "top" | "bottom">("center");
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
    if (!imgRef.current || !text.trim()) return;
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
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let y: number;
      if (position === "top") y = scaledFontSize + 20;
      else if (position === "bottom") y = canvas.height - scaledFontSize - 20;
      else y = canvas.height / 2;

      const lines = text.split("\n");
      const lineHeight = scaledFontSize * 1.3;

      for (let i = 0; i < lines.length; i++) {
        const lineY = y + (i - (lines.length - 1) / 2) * lineHeight;
        const metrics = ctx.measureText(lines[i]);
        const textWidth = metrics.width;
        const padding = scaledFontSize * 0.4;

        if (showBg) {
          ctx.fillStyle = bgColor;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(
            canvas.width / 2 - textWidth / 2 - padding,
            lineY - scaledFontSize / 2 - padding,
            textWidth + padding * 2,
            scaledFontSize + padding * 2
          );
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = color;
        ctx.fillText(lines[i], canvas.width / 2, lineY);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setError("Failed to add text. Please try again.");
      setLoading(false);
    }
  }, [text, fontSize, color, bgColor, showBg, position]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `text-${file.name}`;
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
      title="Add Text to Image Online Free"
      subtitle="Add customizable text overlays to your images. Free, instant tool."
      howToUse={[
        "Upload your image by dragging it into the drop zone.",
        "Enter your text and customize font size, colors, and position.",
        "Toggle the background option if needed.",
        "Click Add Text and download your image.",
      ]}
      faq={[
        {
          question: "Can I add multiple lines of text?",
          answer: "Yes. Use line breaks to create multi-line text overlays. Each line will be centered on the image.",
        },
        {
          question: "Can I add a background behind the text?",
          answer: "Yes. Toggle the background option to add a semi-transparent background behind the text for better readability.",
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
                <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Your text here"
                  rows={3}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={120}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Position</label>
                  <div className="flex gap-1">
                    {(["top", "center", "bottom"] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`cursor-pointer flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-200 capitalize ${
                          position === pos
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Text Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-[var(--color-border)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showBg}
                      onChange={(e) => setShowBg(e.target.checked)}
                      className="cursor-pointer"
                    />
                    {showBg && (
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10 flex-1 cursor-pointer rounded-md border border-[var(--color-border)]"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || !text.trim()} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Adding Text...</span> : "Add Text to Image"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="Text added" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">{formatSize(result.size)}</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Image
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Add More Text
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
