"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

interface ExtractedImage {
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export default function ExtractImagesFromPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(f);
    setImages([]);
    setLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const embeddedImages: ExtractedImage[] = [];
      const pageIndices = doc.getPageIndices();

      for (const idx of pageIndices) {
        const page = doc.getPage(idx);
        const { width, height } = page.getSize();
        const resources = page.node.get(pdfLibDictKey("Resources")) as any;
        if (!resources) continue;

        const xObject = resources.get(pdfLibDictKey("XObject"));
        if (!xObject) continue;

        const xObjectKeys = xObject.keys ? [...xObject.keys()] : [];
        for (const key of xObjectKeys) {
          try {
            const ref = xObject.get(key);
            const obj = ref ? (ref.resolve ? ref.resolve() : ref) : null;
            if (!obj) continue;

            const subtype = obj.get(pdfLibDictKey("Subtype"));
            if (subtype && String(subtype) === "/Image") {
              const img = doc.context.lookup(ref);
              if (img && typeof img === "object" && "bytes" in img) {
                const imgBytes = (img as any).bytes;
                if (imgBytes) {
                  const blob = new Blob([imgBytes.buffer as ArrayBuffer || imgBytes], { type: "image/png" });
                  const url = URL.createObjectURL(blob);
                  embeddedImages.push({
                    name: `page-${idx + 1}-image-${embeddedImages.length + 1}.png`,
                    blob,
                    url,
                    width: Number(obj.get(pdfLibDictKey("Width")) || 0),
                    height: Number(obj.get(pdfLibDictKey("Height")) || 0),
                  });
                }
              }
            }
          } catch {
            // skip non-image XObjects
          }
        }
      }

      if (embeddedImages.length === 0) {
        setError("No embedded images found in this PDF. The PDF may use different image encoding.");
      }
      setImages(embeddedImages);
    } catch {
      setError("Failed to extract images. The PDF may be encrypted or corrupted.");
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadImage = (img: ExtractedImage) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = img.name;
    a.click();
  };

  const downloadAll = () => {
    for (const img of images) {
      downloadImage(img);
    }
  };

  return (
    <ToolLayout
      title="Extract Images from PDF Online Free"
      subtitle="Pull embedded images out of any PDF document. Free, fast, and secure."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "The tool will scan all pages for embedded images.",
        "Preview the extracted images and download individually or all at once.",
      ]}
      faq={[
        {
          question: "What types of images can be extracted?",
          answer: "The tool extracts embedded raster images (JPEG, PNG) that are stored as XObjects in the PDF. Images created from vector graphics may not be extractable.",
        },
        {
          question: "Will extraction reduce image quality?",
          answer: "No. Extracted images retain their original resolution and quality as stored in the PDF.",
        },
        {
          question: "Is my PDF uploaded?",
          answer: "No. All extraction happens in your browser using pdf-lib. Your PDF never leaves your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your PDF here" />
        )}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={() => { setFile(null); setImages([]); setError(""); }}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8">
            <span className="spinner" />
            <span className="text-sm text-[var(--color-muted-foreground)]">Scanning PDF for images...</span>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {images.length > 0 && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">
                Found {images.length} image{images.length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((img, i) => (
                  <div key={i} className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                    <img src={img.url} alt={img.name} className="mb-2 max-h-40 w-full rounded object-contain" />
                    <p className="mb-2 text-xs text-[var(--color-muted-foreground)]">
                      {img.name} — {img.width}x{img.height}
                    </p>
                    <button onClick={() => downloadImage(img)} className="cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={downloadAll} className="btn-primary w-full cursor-pointer">
              Download All Images
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function pdfLibDictKey(_key: string) {
  return { toString: () => `/${_key}` } as any;
}
