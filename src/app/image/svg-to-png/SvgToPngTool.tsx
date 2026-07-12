"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function SvgToPngTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState("");
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");

  const handleFile = useCallback(async (f: File) => {
    if (!f.type.match(/^image\/svg\+xml$/) && !f.name.endsWith(".svg")) {
      setError("Please upload an SVG file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
    setResultUrl("");
    try {
      const content = await f.text();
      setSvgContent(content);
    } catch {
      setError("Failed to read SVG file.");
    }
  }, []);

  const process = useCallback(() => {
    if (!svgContent) return;
    setLoading(true);
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) {
        setError("Invalid SVG file.");
        setLoading(false);
        return;
      }

      let w = parseFloat(svgEl.getAttribute("width") || "0");
      let h = parseFloat(svgEl.getAttribute("height") || "0");
      if (!w || !h) {
        const viewBox = svgEl.getAttribute("viewBox");
        if (viewBox) {
          const parts = viewBox.split(/[\s,]+/).map(Number);
          w = parts[2] || 300;
          h = parts[3] || 300;
        } else {
          w = 300;
          h = 300;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) {
            setResult(blob);
            setResultUrl(URL.createObjectURL(blob));
          }
          setLoading(false);
        }, "image/png");
      };
      img.onerror = () => {
        setError("Failed to render SVG. The file may contain external references.");
        setLoading(false);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch {
      setError("Failed to convert SVG. Please try again.");
      setLoading(false);
    }
  }, [svgContent, scale]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.svg$/i, ".png");
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
      title="SVG to PNG Converter Online Free"
      subtitle="Convert SVG images to PNG format. Instant, free, client-side conversion."
      howToUse={[
        "Upload your SVG file by dragging it into the drop zone.",
        "Choose the scale factor (1x, 2x, 3x, or 4x) for output resolution.",
        "Click Convert to PNG to rasterize the SVG.",
        "Download your PNG image instantly.",
      ]}
      faq={[
        {
          question: "What scale factor should I use?",
          answer: "Use 2x for standard high-quality output. Use 3x or 4x if you need larger dimensions for printing or retina displays.",
        },
        {
          question: "Will my SVG animations be preserved?",
          answer: "No. PNG is a static format. SVG animations will be captured as a single frame at the time of conversion.",
        },
        {
          question: "Is my SVG file uploaded?",
          answer: "No. All conversion happens in your browser. Your SVG file is rendered to Canvas and converted locally.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".svg" onFile={handleFile} label="Drag & drop your SVG file here" />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setSvgContent(""); setResult(null); setResultUrl(""); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-center rounded-md bg-white p-4">
                <div dangerouslySetInnerHTML={{ __html: svgContent }} className="max-h-48" />
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Scale Factor</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      scale === s
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to PNG"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="PNG" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">{formatSize(result.size)}</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download PNG
            </button>
            <button onClick={() => { setResult(null); setResultUrl(""); }} className="btn-secondary w-full cursor-pointer">
              Convert Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
