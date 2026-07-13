"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

type PageSize = "a4" | "letter" | "fit";

interface ImageFile {
  file: File;
  preview: string;
  width: number;
  height: number;
}

const PAGE_SIZES: Record<PageSize, { label: string; width: number; height: number }> = {
  a4: { label: "A4", width: 595, height: 842 },
  letter: { label: "US Letter", width: 612, height: 792 },
  fit: { label: "Fit to Image", width: 0, height: 0 },
};

export default function JpgToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const imageFiles = Array.from(fileList).filter((f) => validTypes.includes(f.type));
    if (imageFiles.length === 0) {
      setError("Please upload JPG, PNG, or WebP images.");
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            { file, preview: e.target?.result as string, width: img.width, height: img.height },
          ]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    setError("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const convert = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const pdfDoc = await PDFDocument.create();
      const { width: defaultW, height: defaultH } = PAGE_SIZES[pageSize];

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        let embedded;

        if (img.file.type === "image/png") {
          embedded = await pdfDoc.embedPng(bytes);
        } else {
          embedded = await pdfDoc.embedJpg(bytes);
        }

        let pageW: number;
        let pageH: number;

        if (pageSize === "fit") {
          pageW = img.width;
          pageH = img.height;
        } else {
          const imgAspect = img.width / img.height;
          const pageAspect = defaultW / defaultH;

          if (imgAspect > pageAspect) {
            pageW = defaultW;
            pageH = defaultW / imgAspect;
          } else {
            pageH = defaultH;
            pageW = defaultH * imgAspect;
          }
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: pageW,
          height: pageH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to convert images to PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        className="drop-zone"
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="jpg-upload"
        />
        <label htmlFor="jpg-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
              <svg className="h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--color-foreground)]">
                Drag & drop JPG, PNG, or WebP images here
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">or click to browse</p>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Supports: JPG, JPEG, PNG, WebP</p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">Page Size</p>
            <div className="flex gap-2">
              {(Object.keys(PAGE_SIZES) as PageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-center text-sm font-medium cursor-pointer transition-all duration-200 ${
                    pageSize === size
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {PAGE_SIZES[size].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {images.map((img, i) => (
              <div
                key={`${img.file.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2"
              >
                <img src={img.preview} alt={img.file.name} className="h-10 w-10 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-foreground)]">{img.file.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{img.width}×{img.height}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveImage(i, "up")}
                    disabled={i === 0}
                    className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveImage(i, "down")}
                    disabled={i === images.length - 1}
                    className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-30 cursor-pointer transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeImage(i)}
                    className="rounded p-1 text-[var(--color-destructive)] hover:bg-red-50 cursor-pointer transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--color-muted-foreground)]">
            {images.length} image{images.length > 1 ? "s" : ""} selected — will create {images.length} page{images.length > 1 ? "s" : ""} PDF
          </p>

          <button onClick={convert} disabled={loading} className="btn-primary w-full cursor-pointer">
            {loading ? <><span className="spinner" /> Converting...</> : "Convert to PDF"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-destructive)] bg-red-50 px-4 py-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}
    </div>
  );
}
