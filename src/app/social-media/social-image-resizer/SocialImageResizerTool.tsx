"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface Preset {
  name: string;
  width: number;
  height: number;
}

interface PlatformPresets {
  label: string;
  presets: Preset[];
}

const PLATFORMS: PlatformPresets[] = [
  {
    label: "Instagram",
    presets: [
      { name: "Post", width: 1080, height: 1080 },
      { name: "Story / Reel", width: 1080, height: 1920 },
      { name: "Profile", width: 320, height: 320 },
      { name: "Carousel", width: 1080, height: 1080 },
    ],
  },
  {
    label: "Facebook",
    presets: [
      { name: "Post", width: 1200, height: 630 },
      { name: "Cover", width: 820, height: 312 },
      { name: "Profile", width: 170, height: 170 },
      { name: "Story", width: 1080, height: 1920 },
    ],
  },
  {
    label: "Twitter / X",
    presets: [
      { name: "Post", width: 1200, height: 675 },
      { name: "Header", width: 1500, height: 500 },
      { name: "Profile", width: 400, height: 400 },
    ],
  },
  {
    label: "LinkedIn",
    presets: [
      { name: "Post", width: 1200, height: 627 },
      { name: "Banner", width: 1584, height: 396 },
      { name: "Profile", width: 400, height: 400 },
    ],
  },
  {
    label: "YouTube",
    presets: [
      { name: "Thumbnail", width: 1280, height: 720 },
      { name: "Banner", width: 2560, height: 1440 },
      { name: "Profile", width: 800, height: 800 },
    ],
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

export default function SocialImageResizerTool({ relatedTools, schema }: Props) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [activePlatform, setActivePlatform] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [quality, setQuality] = useState(92);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState("");
  const [resizedSize, setResizedSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((file: File) => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setSelectedPreset(null);
    setResizedBlob(null);
    setResizedUrl("");
    setResizedSize(0);
  }, [originalUrl, resizedUrl]);

  const handlePreset = useCallback(async (preset: Preset) => {
    if (!originalFile) return;
    setSelectedPreset(preset);
    setProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) { setProcessing(false); return; }

      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setProcessing(false); return; }

      ctx.clearRect(0, 0, preset.width, preset.height);
      ctx.drawImage(img, 0, 0, preset.width, preset.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            setResizedBlob(blob);
            setResizedUrl(URL.createObjectURL(blob));
            setResizedSize(blob.size);
          }
          setProcessing(false);
        },
        "image/jpeg",
        quality / 100
      );

      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => setProcessing(false);
    img.src = URL.createObjectURL(originalFile);
  }, [originalFile, quality, resizedUrl]);

  const handleDownload = useCallback(() => {
    if (!resizedBlob || !selectedPreset) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(resizedBlob);
    a.download = `resized-${selectedPreset.name.toLowerCase().replace(/\s+/g, "-")}-${selectedPreset.width}x${selectedPreset.height}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [resizedBlob, selectedPreset]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setOriginalFile(null);
    setOriginalUrl("");
    setOriginalSize(0);
    setSelectedPreset(null);
    setResizedBlob(null);
    setResizedUrl("");
    setResizedSize(0);
  }, [originalUrl, resizedUrl]);

  return (
    <ToolLayout
      title="Social Media Image Resizer"
      subtitle="Resize images for Instagram, Facebook, Twitter/X, LinkedIn, and YouTube with preset dimensions."
      howToUse={[
        "Drag & drop or click to upload an image (JPG, PNG, or WebP).",
        "Select a platform tab (Instagram, Facebook, etc.) to see available size presets.",
        "Click a preset to resize your image to those exact dimensions.",
        "Adjust the quality slider if needed, then download the resized image.",
      ]}
      faq={[
        { question: "Does resizing reduce image quality?", answer: "Resizing always involves some trade-off. We use high-quality canvas rendering and allow you to control JPEG quality. For best results, upload images larger than the target dimensions." },
        { question: "What formats are supported?", answer: "We support JPG, JPEG, PNG, and WebP input formats. Output is always JPEG for maximum compatibility with social media platforms." },
        { question: "Is my image uploaded to a server?", answer: "No. All resizing happens in your browser using the HTML5 Canvas API. Your image never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!originalFile ? (
          <FileDropZone accept=".jpg,.jpeg,.png,.webp" onFile={handleFile} label="Drag & drop your image here" />
        ) : (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Original Image</h3>
                <button onClick={handleReset} className="text-sm font-medium text-red-500 hover:underline cursor-pointer">
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-4">
                <img src={originalUrl} alt="Original" className="h-20 w-20 rounded-md object-cover" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{originalFile.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{formatFileSize(originalSize)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="flex overflow-x-auto border-b border-[var(--color-border)]">
                {PLATFORMS.map((platform, i) => (
                  <button
                    key={platform.label}
                    onClick={() => { setActivePlatform(i); setSelectedPreset(null); setResizedBlob(null); setResizedUrl(""); setResizedSize(0); }}
                    className={`shrink-0 px-5 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                      activePlatform === i
                        ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {platform.label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PLATFORMS[activePlatform].presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePreset(preset)}
                      disabled={processing}
                      className={`rounded-lg border p-3 text-left transition-colors duration-200 cursor-pointer disabled:opacity-50 ${
                        selectedPreset?.name === preset.name && selectedPreset?.width === preset.width
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                          : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">{preset.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{preset.width} x {preset.height}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">JPEG Quality</label>
                <span className="text-sm font-bold text-[var(--color-foreground)]">{quality}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {processing && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
                <p className="text-sm text-[var(--color-muted-foreground)]">Resizing image...</p>
              </div>
            )}

            {resizedUrl && !processing && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Result</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img src={resizedUrl} alt="Resized" className="max-h-40 rounded-md object-contain" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">
                      {selectedPreset?.width} x {selectedPreset?.height}
                    </p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{formatFileSize(resizedSize)}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                      {resizedSize < originalSize
                        ? `${((1 - resizedSize / originalSize) * 100).toFixed(0)}% smaller`
                        : `${((resizedSize / originalSize - 1) * 100).toFixed(0)}% larger`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDownload} className="btn-primary px-6 py-2.5 font-semibold cursor-pointer">
                    Download Resized
                  </button>
                  <button onClick={() => { setResizedBlob(null); setResizedUrl(""); setResizedSize(0); setSelectedPreset(null); }} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer">
                    Reset
                  </button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
    </ToolLayout>
  );
}
