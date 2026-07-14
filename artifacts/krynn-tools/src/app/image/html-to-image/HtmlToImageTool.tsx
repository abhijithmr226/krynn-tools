import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const DEFAULT_HTML = `<div style="
  width: 600px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  border-radius: 16px;
">
  <h1 style="margin: 0 0 16px; font-size: 32px;">Hello World</h1>
  <p style="margin: 0; font-size: 18px; opacity: 0.9;">
    Edit this HTML and convert it to an image.
  </p>
</div>`;

export default function HtmlToImageTool({ relatedTools, schema }: Props) {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const process = useCallback(async () => {
    if (!html.trim()) {
      setError("Please enter some HTML code.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setResultUrl("");

    try {
      const canvas = document.createElement("canvas");
      const scale = 2;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.innerHTML = html;
      document.body.appendChild(container);

      await new Promise((r) => setTimeout(r, 100));

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        document.body.removeChild(container);
        throw new Error("Canvas not supported");
      }

      ctx.scale(scale, scale);

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:${rect.width}px;height:${rect.height}px;">
              ${container.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      document.body.removeChild(container);

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to render SVG"));
        img.src = svgUrl;
      });

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(svgUrl);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );

      setResult(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("Failed to convert HTML. This may be due to external resources or complex layouts. Try simplifying your HTML.");
    } finally {
      setLoading(false);
    }
  }, [html]);

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = "html-to-image.png";
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
      title="HTML to Image Converter Online Free"
      subtitle="Convert HTML code into downloadable PNG images instantly."
      howToUse={[
        "Enter your HTML code in the editor below.",
        "Preview the rendered output in the preview panel.",
        "Click Convert to Image to render it as a PNG.",
        "Download your generated PNG image.",
      ]}
      faq={[
        {
          question: "What HTML features are supported?",
          answer: "Basic HTML and inline CSS work well. External stylesheets, fonts, and JavaScript are not supported. Use inline styles for best results.",
        },
        {
          question: "Can I use images in my HTML?",
          answer: "Yes, as long as the image URLs are publicly accessible. However, cross-origin restrictions may prevent some images from rendering.",
        },
        {
          question: "What resolution will the output be?",
          answer: "The output is rendered at 2x resolution for crisp results. The actual pixel size depends on your HTML dimensions.",
        },
        {
          question: "Is this processed on a server?",
          answer: "No. Everything happens in your browser using SVG foreignObject rendering. No data is sent to any server.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">HTML Code</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
            placeholder="Enter your HTML code here..."
          />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Preview</label>
          <div className="flex justify-center overflow-auto rounded-md border border-[var(--color-border)] bg-white p-4 dark:shadow-lg">
            <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {!result && (
          <button onClick={process} disabled={loading || !html.trim()} className="btn-primary w-full cursor-pointer">
            {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to Image"}
          </button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center overflow-auto">
                <img src={resultUrl} alt="Generated image" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                PNG: {formatSize(result.size)}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download PNG
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Convert Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
