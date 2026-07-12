"use client";

import { useState, useRef, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  title: string;
  subtitle: string;
  howToUse: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const formats = [
  { value: "CODE128", label: "CODE128", example: "Hello123" },
  { value: "EAN13", label: "EAN-13", example: "5901234123457" },
  { value: "EAN8", label: "EAN-8", example: "96385074" },
  { value: "UPC", label: "UPC-A", example: "123456789012" },
  { value: "CODE39", label: "CODE39", example: "CODE39" },
  { value: "ITF14", label: "ITF-14", example: "12345678901231" },
  { value: "MSI", label: "MSI", example: "1234567" },
];

export default function BarcodeGeneratorTool({
  title,
  subtitle,
  howToUse,
  faq,
  relatedTools,
  schema,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [text, setText] = useState("");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(() => {
    if (!text.trim()) {
      setError("Please enter text or numbers to encode.");
      setGenerated(false);
      return;
    }

    try {
      JsBarcode(svgRef.current, text, {
        format,
        lineColor: "#0F172A",
        background: "transparent",
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 10,
      });
      setError("");
      setGenerated(true);
    } catch (err) {
      setError(`Invalid input for ${format} format. ${err instanceof Error ? err.message : "Check the format requirements."}`);
      setGenerated(false);
    }
  }, [text, format]);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${format.toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Barcode Content</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`e.g. ${formats.find((f) => f.value === format)?.example || "Hello123"}`}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Barcode Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {formats.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-6 w-full cursor-pointer">
          Generate Barcode
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-[var(--color-muted)] p-4 text-sm text-[var(--color-destructive)]">
            {error}
          </div>
        )}

        {generated && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center rounded-lg bg-[var(--color-background)] p-6">
              <svg ref={svgRef} />
            </div>
            <button onClick={handleDownload} className="btn-secondary w-full cursor-pointer">
              Download SVG
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
