import { useState, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function QrCodeGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter text or a URL to encode.");
      setGenerated(false);
      return;
    }
    setError("");
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      setGenerated(true);
    } catch {
      setError("Failed to generate QR code. The input may be too long for the selected size.");
      setGenerated(false);
    }
  }, [text, size, fgColor, bgColor]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
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
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Text or URL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, or any data to encode..."
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Size: {size}px
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full cursor-pointer"
            >
              <option value={128}>128 x 128</option>
              <option value={256}>256 x 256</option>
              <option value={512}>512 x 512</option>
              <option value={1024}>1024 x 1024</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Foreground
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-[var(--color-border)]"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-[var(--color-border)]"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="btn-primary cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Generate QR Code
          </button>
          {generated && (
            <button onClick={handleDownload} className="btn-secondary cursor-pointer">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-[var(--color-destructive)] bg-red-50 p-4 text-sm text-[var(--color-destructive)]">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <canvas
            ref={canvasRef}
            className={`rounded-lg border border-[var(--color-border)] ${generated ? "" : "hidden"}`}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
