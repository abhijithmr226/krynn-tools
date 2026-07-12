"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function QrCodeScannerTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError("");
    setScannedResult("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      setError("Camera access denied or not available. Try uploading an image instead.");
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setScannedResult("");

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setError("Image uploaded. QR detection requires the jsQR library which is not yet installed. Please install jsQR to enable scanning.");
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleCopy = async () => {
    if (!scannedResult) return;
    await navigator.clipboard.writeText(scannedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = (str: string) => {
    try { new URL(str); return true; } catch { return false; }
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
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors duration-200 cursor-pointer ${
                cameraActive
                  ? "bg-[var(--color-destructive)] text-white hover:opacity-90"
                  : "btn-primary"
              }`}
            >
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </button>
            <label className="btn-secondary flex-1 cursor-pointer text-center">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {cameraActive && (
            <div className="relative overflow-hidden rounded-lg bg-black">
              <video ref={videoRef} className="w-full" playsInline muted />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 border-2 border-[var(--color-primary)] opacity-60" />
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="rounded-lg bg-[var(--color-muted)] p-4 text-sm text-[var(--color-muted-foreground)]">
              {error}
            </div>
          )}

          {scannedResult && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-foreground)]">Scanned Content</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm break-all text-[var(--color-foreground)]">
                  {isUrl(scannedResult) ? (
                    <a href={scannedResult} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
                      {scannedResult}
                    </a>
                  ) : (
                    scannedResult
                  )}
                </div>
                <button onClick={handleCopy} className="btn-secondary shrink-0 cursor-pointer px-4 py-3">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {!cameraActive && !error && !scannedResult && (
            <div className="rounded-lg bg-[var(--color-muted)] p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-[var(--color-muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                Start the camera or upload an image to scan a QR code
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
