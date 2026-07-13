"use client";

import { useState, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function WordToPdfTool({ relatedTools, schema }: Props) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setResult(null);
    try {
      const content = await f.text();
      setText(content);
      setTitle(f.name.replace(/\.[^.]+$/, ""));
    } catch {
      setError("Failed to read the file. Please try again.");
    }
  }, []);

  const process = async () => {
    if (!text.trim()) {
      setError("Please enter some text content.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = fontSize * 1.4;

      let page = doc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      if (title) {
        y -= fontSize + 10;
        page.drawText(title, {
          x: margin,
          y,
          size: fontSize + 6,
          font: boldFont,
          color: rgb(0, 0, 0),
          maxWidth,
        });
        y -= lineHeight + 10;
      }

      const lines = text.split("\n");
      for (const line of lines) {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        const trimmed = line.trimEnd();
        if (trimmed === "") {
          y -= lineHeight * 0.5;
          continue;
        }
        const words = trimmed.split(" ");
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, fontSize);
          if (width > maxWidth && currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
              maxWidth,
            });
            y -= lineHeight;
            if (y < margin + lineHeight) {
              page = doc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth,
          });
          y -= lineHeight;
        }
      }

      const pdfBytes = await doc.save();
      setResult(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
    } catch {
      setError("Failed to create PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Word to PDF Converter Online Free"
      subtitle="Convert text content to PDF documents. Free, instant conversion."
      howToUse={[
        "Paste your text into the text area, or upload a text file.",
        "Optionally enter a title for the PDF document.",
        "Adjust the font size as needed.",
        "Click Convert to PDF and download your document.",
      ]}
      faq={[
        {
          question: "What text files can I upload?",
          answer: "You can upload any plain text file (.txt). The content will be read and converted to a formatted PDF.",
        },
        {
          question: "Can I customize the font size?",
          answer: "Yes. You can choose from several font sizes before converting. The default is 12pt.",
        },
        {
          question: "Is my text uploaded to a server?",
          answer: "No. All conversion happens in your browser using pdf-lib. Your text never leaves your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Document Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Document"
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Text Content</label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setResult(null); setError(""); }}
              placeholder="Paste your text here or upload a file..."
              rows={10}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
              >
                {[8, 10, 12, 14, 16, 18, 20, 24].map((s) => (
                  <option key={s} value={s}>{s}pt</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">Or upload a text file</label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFile}
                className="cursor-pointer text-sm text-[var(--color-muted-foreground)]"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        {!result && (
          <button onClick={process} disabled={loading || !text.trim()} className="btn-primary w-full cursor-pointer">
            {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Converting...</span> : "Convert to PDF"}
          </button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">PDF created successfully — {(result.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download PDF
            </button>
            <button onClick={() => { setResult(null); setText(""); setTitle(""); }} className="btn-secondary w-full cursor-pointer">
              Convert Another
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
