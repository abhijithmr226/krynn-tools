"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function GifToJpgTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".gif") && !f.type.match(/^image\/gif$/)) {
      setError("Please upload a GIF image.");
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

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResult(blob);
            setResultUrl(URL.createObjectURL(blob));
          } else {
            setError("JPG conversion not supported in this browser.");
          }
          setLoading(false);
        },
        "image/jpeg",
        quality / 100
      );
    } catch {
      setError("Failed to convert GIF. Please try again.");
      setLoading(false);
    }
  }, [quality]);

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.gif$/i, "") + ".jpg";
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
      title="GIF to JPG Converter Online Free"
      subtitle="Convert GIF images to high-quality JPG format. Extracts the first frame from animated GIFs."
      howToUse={[
        "Upload your GIF image by dragging it into the drop zone or clicking to browse.",
        "Adjust the JPG quality slider for file size vs image quality.",
        "Click Convert to JPG to start the conversion.",
        "Download your converted JPG file instantly.",
      ]}
      faq={[
        {
          question: "Does this support animated GIFs?",
          answer: "Animated GIFs will have only the first frame extracted and converted to a static JPG. The animation will not be preserved.",
        },
        {
          question: "What quality should I use?",
          answer: "A quality of 80-90 provides a good balance between file size and visual quality. Lower values produce smaller files.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All conversion happens in your browser using the Canvas API. Your files never leave your device.",
        },
        {
          question: "Why convert GIF to JPG?",
          answer: "JPG files are generally smaller than GIFs and support millions of colors. Converting can reduce file size significantly for non-animated images.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".gif" onFile={handleFile} />
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
              <p className="mt-2 text-center text-sm text-[var(--color-muted-foreground)]">
                Original: {formatSize(file.size)}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
                JPG Quality: {quality}%
              </label>
              <input
                type="range"
                min={10}
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

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to JPG"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex justify-center">
                <img src={resultUrl} alt="JPG result" className="max-h-64 rounded-md object-contain" />
              </div>
              <p className="mt-3 text-center text-sm text-[var(--color-muted-foreground)]">
                JPG: {formatSize(result.size)}
                {file && ` (was ${formatSize(file.size)})`}
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download JPG
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
