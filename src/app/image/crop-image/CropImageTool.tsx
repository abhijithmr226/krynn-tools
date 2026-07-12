"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";
import Link from "next/link";

interface CropImageToolProps {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ASPECT_PRESETS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "9:16", value: 9 / 16 },
];

export default function CropImageTool({
  relatedTools,
  schema,
}: CropImageToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [aspectPreset, setAspectPreset] = useState<number | null>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const displayRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    setError("");
    setFile(f);
    setResultBlob(null);
    setAspectPreset(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
        imgRef.current = img;
        const maxW = 600;
        const maxH = 400;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        displayRef.current = {
          w: dw,
          h: dh,
          offsetX: (maxW - dw) / 2,
          offsetY: (maxH - dh) / 2,
        };
        setCrop({
          x: 0,
          y: 0,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imgRef.current;
    const { w, h, offsetX, offsetY } = displayRef.current;
    canvas.width = w + offsetX * 2;
    canvas.height = h + offsetY * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, w, h);

    const sx = crop.x / imgNatural.w;
    const sy = crop.y / imgNatural.h;
    const sw = crop.width / imgNatural.w;
    const sh = crop.height / imgNatural.h;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(offsetX, offsetY, w, h);
    ctx.drawImage(
      img,
      sx * w + offsetX,
      sy * h + offsetY,
      sw * w,
      sh * h,
      sx * w + offsetX,
      sy * h + offsetY,
      sw * w,
      sh * h
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx * w + offsetX, sy * h + offsetY, sw * w, sh * h);
  }, [crop, imgNatural, preview]);

  const handleAspectChange = useCallback(
    (ratio: number | null) => {
      setAspectPreset(ratio);
      if (ratio && imgNatural.w && imgNatural.h) {
        const currentRatio = crop.width / crop.height;
        if (Math.abs(currentRatio - ratio) > 0.01) {
          let newW = crop.width;
          let newH = crop.width / ratio;
          if (newH > imgNatural.h) {
            newH = imgNatural.h;
            newW = newH * ratio;
          }
          setCrop({ x: crop.x, y: crop.y, width: newW, height: newH });
        }
      }
    },
    [crop, imgNatural]
  );

  const handleCrop = useCallback(async () => {
    if (!imgRef.current) return;
    setLoading(true);
    setError("");
    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      setResultBlob(blob);
    } catch {
      setError("Crop failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [crop]);

  const handleDownload = useCallback(() => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resultBlob, file]);

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ToolLayout
      title="Crop Image Online Free"
      subtitle="Crop images with custom aspect ratios. No upload needed."
      howToUse={[
        "Drag and drop your image into the upload area or click to browse.",
        "Choose an aspect ratio preset or leave it on Free for custom cropping.",
        "Click the Crop Image button to process your selection.",
        "Download your cropped image instantly.",
      ]}
      faq={[
        {
          question: "What aspect ratios are available?",
          answer:
            "You can choose Free (custom), 1:1, 4:3, 16:9, 3:2, and 9:16 aspect ratio presets.",
        },
        {
          question: "Does cropping reduce image quality?",
          answer:
            "No. Cropping simply removes parts of the image. The remaining area retains its original quality and resolution.",
        },
        {
          question: "Is my image uploaded?",
          answer:
            "No. All cropping is done in your browser using the Canvas API. Your image never leaves your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".jpg,.jpeg,.png,.webp" onFile={handleFile} />
        )}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                  setResultBlob(null);
                  setError("");
                }}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-destructive)] transition-colors duration-200 hover:bg-[var(--color-muted)]"
              >
                Remove
              </button>
            </div>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-md"
                style={{ maxHeight: 400 }}
              />
            </div>
          </div>
        )}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleAspectChange(preset.value)}
                  className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    aspectPreset === preset.value
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">
                  Crop X
                </label>
                <input
                  type="number"
                  min={0}
                  max={imgNatural.w}
                  value={Math.round(crop.x)}
                  onChange={(e) =>
                    setCrop({ ...crop, x: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">
                  Crop Y
                </label>
                <input
                  type="number"
                  min={0}
                  max={imgNatural.h}
                  value={Math.round(crop.y)}
                  onChange={(e) =>
                    setCrop({ ...crop, y: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">
                  Width
                </label>
                <input
                  type="number"
                  min={1}
                  max={imgNatural.w}
                  value={Math.round(crop.width)}
                  onChange={(e) =>
                    setCrop({ ...crop, width: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">
                  Height
                </label>
                <input
                  type="number"
                  min={1}
                  max={imgNatural.h}
                  value={Math.round(crop.height)}
                  onChange={(e) =>
                    setCrop({ ...crop, height: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {file && !resultBlob && (
          <button
            onClick={handleCrop}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" /> Cropping...
              </span>
            ) : (
              "Crop Image"
            )}
          </button>
        )}

        {resultBlob && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Cropped: {Math.round(crop.width)} x {Math.round(crop.height)} px —{" "}
                {formatSize(resultBlob.size)}
              </p>
            </div>
            <button onClick={handleDownload} className="btn-primary w-full">
              Download Cropped Image
            </button>
            <button
              onClick={() => setResultBlob(null)}
              className="btn-secondary w-full"
            >
              Crop Again
            </button>

            {/* ── What's Next? ── */}
            <div style={{ marginTop: "8px" }}>
              <p style={{
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--color-muted-foreground)",
                marginBottom: "12px",
              }}>
                What&apos;s next with your image?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                {[
                  {
                    href: "/image/compress-image",
                    label: "Compress Image",
                    desc: "Reduce file size up to 80%",
                    icon: "📦",
                    accent: "#7C3AED",
                  },
                  {
                    href: "/image/webp-converter",
                    label: "Convert to WebP",
                    desc: "Modern format, smaller size",
                    icon: "⚡",
                    accent: "#0284C7",
                  },
                  {
                    href: "/image/png-to-jpg",
                    label: "PNG → JPG",
                    desc: "Lighter for sharing & web",
                    icon: "🖼️",
                    accent: "#059669",
                  },
                  {
                    href: "/image/jpg-to-png",
                    label: "JPG → PNG",
                    desc: "Lossless with transparency",
                    icon: "✨",
                    accent: "#E8100A",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "block", padding: "14px", borderRadius: "10px",
                      border: `1.5px solid ${item.accent}28`,
                      background: `${item.accent}0c`,
                      textDecoration: "none", color: "inherit",
                      transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                      e.currentTarget.style.borderColor = item.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.borderColor = `${item.accent}28`;
                    }}
                  >
                    <div style={{ fontSize: "1.25rem", marginBottom: "6px" }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.8125rem", marginBottom: "4px", color: item.accent }}>{item.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
