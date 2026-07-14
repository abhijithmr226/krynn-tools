import { useState, useCallback } from "react";
import { FileDropZone } from "@/components/ToolLayout";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type FileCategory = "image" | "text" | "unknown";

interface FileInfo {
  file: File;
  category: FileCategory;
  detectedType: string;
  previewUrl: string | null;
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/gif": "gif",
};

const TEXT_TYPES: Record<string, string> = {
  "text/plain": "txt",
  "text/csv": "csv",
  "application/json": "json",
  "text/json": "json",
  "application/xml": "xml",
  "text/xml": "xml",
};

const IMAGE_OUTPUT_FORMATS = [
  { value: "jpg", label: "JPG", mime: "image/jpeg" },
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "webp", label: "WebP", mime: "image/webp" },
  { value: "bmp", label: "BMP", mime: "image/bmp" },
  { value: "pdf", label: "PDF", mime: "application/pdf" },
];

const TEXT_OUTPUT_FORMATS = [
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
  { value: "xml", label: "XML" },
  { value: "txt", label: "TXT" },
  { value: "pdf", label: "PDF" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function detectFileType(file: File): { category: FileCategory; detectedType: string } {
  if (IMAGE_TYPES[file.type]) {
    return { category: "image", detectedType: IMAGE_TYPES[file.type] };
  }
  if (TEXT_TYPES[file.type]) {
    return { category: "text", detectedType: TEXT_TYPES[file.type] };
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const extToImage: Record<string, string> = { jpg: "jpg", jpeg: "jpg", png: "png", webp: "webp", bmp: "bmp", gif: "gif" };
  const extToText: Record<string, string> = { txt: "txt", csv: "csv", json: "json", xml: "xml" };
  if (extToImage[ext]) return { category: "image", detectedType: extToImage[ext] };
  if (extToText[ext]) return { category: "text", detectedType: extToText[ext] };
  if (file.type.startsWith("image/")) return { category: "image", detectedType: file.type.split("/")[1] || "unknown" };
  if (file.type.startsWith("text/") || file.type === "application/json" || file.type === "application/xml") {
    return { category: "text", detectedType: ext || "txt" };
  }
  return { category: "unknown", detectedType: ext || "unknown" };
}

function getOutputFormats(category: FileCategory) {
  if (category === "image") return IMAGE_OUTPUT_FORMATS;
  if (category === "text") return TEXT_OUTPUT_FORMATS;
  return [];
}

function getBaseName(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(0, lastDot) : filename;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file as text"));
    reader.readAsText(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/* ── CSV Parsing ── */

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

function csvToJson(csvText: string): string {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    if (lines.length === 1) {
      const headers = parseCSVLine(lines[0], ",");
      return JSON.stringify(headers.map((h) => ({ [h.trim()]: "" })), null, 2);
    }
    return JSON.stringify([]);
  }

  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = parseCSVLine(lines[0], delimiter).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index].trim() : "";
    });
    rows.push(row);
  }

  return JSON.stringify(rows, null, 2);
}

function jsonToCsv(jsonText: string): string {
  const data = JSON.parse(jsonText);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";

  const allKeys = new Set<string>();
  for (const obj of arr) {
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((k) => allKeys.add(k));
    }
  }
  const headers = Array.from(allKeys);

  const escapeCSV = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.map(escapeCSV).join(","),
    ...arr.map((obj) =>
      headers.map((h) => escapeCSV(obj?.[h])).join(",")
    ),
  ];

  return csvLines.join("\n");
}

/* ── XML Conversion ── */

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function jsonValueToXml(value: unknown, indent: string): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return escapeXml(String(value));
  }
  if (Array.isArray(value)) {
    return value.map((item) => `${indent}  <item>\n${jsonValueToXml(item, indent + "  ")}\n${indent}  </item>`).join("\n");
  }
  if (typeof value === "object") {
    return jsonKeyValueToXml(value as Record<string, unknown>, indent);
  }
  return escapeXml(String(value));
}

function jsonKeyValueToXml(obj: Record<string, unknown>, indent: string): string {
  return Object.entries(obj)
    .map(([key, val]) => {
      const safeKey = key.replace(/[^a-zA-Z0-9_.-]/g, "_");
      if (val === null || val === undefined) {
        return `${indent}<${safeKey}/>`;
      }
      if (Array.isArray(val)) {
        const items = val.map((item) => {
          if (typeof item === "object" && item !== null) {
            const inner = jsonKeyValueToXml(item as Record<string, unknown>, indent + "    ");
            return `\n${indent}  <item>\n${inner}\n${indent}  </item>`;
          }
          return `\n${indent}  <item>${escapeXml(String(item))}</item>`;
        }).join("");
        return `${indent}<${safeKey}>${items}\n${indent}</${safeKey}>`;
      }
      if (typeof val === "object") {
        const inner = jsonKeyValueToXml(val as Record<string, unknown>, indent + "  ");
        return `${indent}<${safeKey}>\n${inner}\n${indent}</${safeKey}>`;
      }
      return `${indent}<${safeKey}>${escapeXml(String(val))}</${safeKey}>`;
    })
    .join("\n");
}

function jsonToXml(jsonText: string): string {
  const data = JSON.parse(jsonText);
  const rootKey = Array.isArray(data) ? "root" : Object.keys(data)[0] || "root";
  const content = Array.isArray(data) ? data : data[rootKey] || data;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  if (Array.isArray(content)) {
    xml += `<${rootKey}>\n`;
    for (const item of content) {
      xml += "  <item>\n";
      xml += jsonKeyValueToXml(item as Record<string, unknown>, "    ");
      xml += "\n  </item>\n";
    }
    xml += `</${rootKey}>`;
  } else if (typeof content === "object" && content !== null) {
    xml += `<${rootKey}>\n`;
    xml += jsonKeyValueToXml(content as Record<string, unknown>, "  ");
    xml += `\n</${rootKey}>`;
  } else {
    xml += `<${rootKey}>${escapeXml(String(content))}</${rootKey}>`;
  }

  return xml;
}

function xmlToJson(xmlText: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }

  function nodeToObj(node: ChildNode): unknown {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as Element;
    const children = Array.from(element.childNodes).filter(
      (c) => c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.textContent?.trim())
    );

    if (children.length === 0) return "";
    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      return children[0].textContent?.trim() || "";
    }

    const obj: Record<string, unknown> = {};
    for (const child of children) {
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const key = child.nodeName;
      const value = nodeToObj(child);

      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
        (obj[key] as unknown[]).push(value);
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  const root = doc.documentElement;
  const result: Record<string, unknown> = {};
  result[root.nodeName] = nodeToObj(root);
  return JSON.stringify(result, null, 2);
}

/* ── Image Conversion via Canvas ── */

function convertImage(
  img: HTMLImageElement,
  targetFormat: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }
    ctx.drawImage(img, 0, 0);

    let mimeType: string;
    switch (targetFormat) {
      case "jpg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      case "webp":
        mimeType = "image/webp";
        break;
      case "bmp":
        mimeType = "image/bmp";
        break;
      default:
        mimeType = "image/png";
    }

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert image"));
      },
      mimeType,
      targetFormat === "jpg" || targetFormat === "webp" ? quality : undefined
    );
  });
}

/* ── Image to PDF via pdf-lib ── */

async function imageToPdf(img: HTMLImageElement): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const pngDataUrl = (() => {
    const canvas = document.createElement("canvas");
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  })();

  if (!pngDataUrl) throw new Error("Failed to render image for PDF");

  const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) => c.charCodeAt(0));
  const pngImage = await pdfDoc.embedPng(pngBytes);

  const pageWidth = Math.max(imgWidth, 1);
  const pageHeight = Math.max(imgHeight, 1);
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  return pdfDoc.save();
}

/* ── Text to PDF via pdf-lib ── */

async function textToPdf(text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.4;
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;

  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    const words = paragraph.split(" ");
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const line of lines) {
    if (y < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (line) {
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
    }
    y -= lineHeight;
  }

  return pdfDoc.save();
}

/* ── Main Component ── */

export default function FileConverterTool() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [quality, setQuality] = useState(0.85);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string; filename: string } | null>(null);
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    if (result?.url) URL.revokeObjectURL(result.url);
    const { category, detectedType } = detectFileType(file);
    if (category === "unknown") {
      setError("Unsupported file type. Please upload an image or text file.");
      return;
    }
    setError("");
    setResult(null);
    setStatus("");
    const previewUrl = category === "image" ? URL.createObjectURL(file) : null;
    setFileInfo({ file, category, detectedType, previewUrl });
    const formats = getOutputFormats(category);
    setOutputFormat(formats[0]?.value || "");
  }, [result]);

  const handleConvert = useCallback(async () => {
    if (!fileInfo || !outputFormat) return;
    setConverting(true);
    setError("");
    setStatus("Converting...");
    setResult(null);

    try {
      if (fileInfo.category === "image") {
        const img = await loadImage(fileInfo.previewUrl!);

        if (outputFormat === "pdf") {
          setStatus("Generating PDF...");
          const pdfBytes = await imageToPdf(img);
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".pdf";
          setResult({ blob, url, filename });
        } else {
          setStatus("Processing image...");
          const blob = await convertImage(img, outputFormat, quality);
          const url = URL.createObjectURL(blob);
          const extMap: Record<string, string> = { jpg: "jpg", png: "png", webp: "webp", bmp: "bmp" };
          const filename = getBaseName(fileInfo.file.name) + "." + (extMap[outputFormat] || outputFormat);
          setResult({ blob, url, filename });
        }
      } else if (fileInfo.category === "text") {
        const text = await readFileAsText(fileInfo.file);

        if (outputFormat === "pdf") {
          setStatus("Generating PDF...");
          const pdfBytes = await textToPdf(text);
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".pdf";
          setResult({ blob, url, filename });
        } else if (outputFormat === "json") {
          setStatus("Converting to JSON...");
          let jsonStr: string;
          if (fileInfo.detectedType === "csv") {
            jsonStr = csvToJson(text);
          } else if (fileInfo.detectedType === "xml") {
            jsonStr = xmlToJson(text);
          } else {
            try {
              JSON.parse(text);
              jsonStr = text;
            } catch {
              throw new Error("Input is not valid JSON, CSV, or XML");
            }
          }
          const blob = new Blob([jsonStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".json";
          setResult({ blob, url, filename });
        } else if (outputFormat === "csv") {
          setStatus("Converting to CSV...");
          let csvStr: string;
          if (fileInfo.detectedType === "json") {
            csvStr = jsonToCsv(text);
          } else if (fileInfo.detectedType === "csv") {
            csvStr = text;
          } else {
            throw new Error("Can only convert JSON or CSV to CSV");
          }
          const blob = new Blob([csvStr], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".csv";
          setResult({ blob, url, filename });
        } else if (outputFormat === "xml") {
          setStatus("Converting to XML...");
          let xmlStr: string;
          if (fileInfo.detectedType === "json") {
            xmlStr = jsonToXml(text);
          } else if (fileInfo.detectedType === "xml") {
            xmlStr = text;
          } else {
            throw new Error("Can only convert JSON or XML to XML");
          }
          const blob = new Blob([xmlStr], { type: "application/xml" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".xml";
          setResult({ blob, url, filename });
        } else if (outputFormat === "txt") {
          setStatus("Converting to TXT...");
          let txtStr = text;
          if (fileInfo.detectedType === "json") {
            txtStr = JSON.stringify(JSON.parse(text), null, 2);
          } else if (fileInfo.detectedType === "csv") {
            txtStr = text;
          } else if (fileInfo.detectedType === "xml") {
            const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
            txtStr = xmlDoc.documentElement.textContent || text;
          }
          const blob = new Blob([txtStr], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const filename = getBaseName(fileInfo.file.name) + ".txt";
          setResult({ blob, url, filename });
        }
      }

      setStatus("Conversion complete!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try a different format.");
      setStatus("");
    } finally {
      setConverting(false);
    }
  }, [fileInfo, outputFormat, quality]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename;
    a.click();
  }, [result]);

  const handleReset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    if (fileInfo?.previewUrl) URL.revokeObjectURL(fileInfo.previewUrl);
    setFileInfo(null);
    setOutputFormat("");
    setResult(null);
    setStatus("");
    setError("");
  }, [result, fileInfo]);

  const availableFormats = fileInfo ? getOutputFormats(fileInfo.category) : [];
  const showQuality = fileInfo?.category === "image" && (outputFormat === "jpg" || outputFormat === "webp");

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      {!fileInfo ? (
        <FileDropZone
          accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,.txt,.csv,.json,.xml"
          onFile={handleFile}
          label="Drop a file here to convert"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
            {fileInfo.previewUrl && (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]">
                <img src={fileInfo.previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-foreground)]">{fileInfo.file.name}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {formatBytes(fileInfo.file.size)} &middot; {fileInfo.detectedType.toUpperCase()} &middot; {fileInfo.category === "image" ? "Image" : "Text"}
              </p>
            </div>
            <button onClick={handleReset} className="shrink-0 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer">
              Change File
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">Convert To</label>
            <div className="flex flex-wrap gap-2">
              {availableFormats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOutputFormat(f.value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    outputFormat === f.value
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {showQuality && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--color-muted-foreground)]">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-[var(--color-destructive)]/10 p-4 text-sm text-[var(--color-destructive)]">
              {error}
            </div>
          )}

          {converting ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="spinner" />
              <span className="text-sm text-[var(--color-muted-foreground)]">{status}</span>
            </div>
          ) : !result ? (
            <button onClick={handleConvert} disabled={!outputFormat} className="btn-primary w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Convert File
            </button>
          ) : null}

          {result && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <p className="text-sm font-medium text-[var(--color-foreground)]">Conversion Complete</p>
                <div className="mt-2 flex flex-col gap-1 text-xs text-[var(--color-muted-foreground)]">
                  <span>Output: <span className="text-[var(--color-foreground)]">{result.filename}</span></span>
                  <span>
                    Size: <span className="text-[var(--color-foreground)]">{formatBytes(result.blob.size)}</span>
                    {result.blob.size < fileInfo.file.size && (
                      <span className="ml-2 text-green-500">
                        ({Math.round((1 - result.blob.size / fileInfo.file.size) * 100)}% smaller)
                      </span>
                    )}
                    {result.blob.size > fileInfo.file.size && (
                      <span className="ml-2 text-[var(--color-muted-foreground)]">
                        ({Math.round(((result.blob.size / fileInfo.file.size) - 1) * 100)}% larger)
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <button onClick={handleDownload} className="btn-primary w-full cursor-pointer">
                Download {result.filename}
              </button>
              <button onClick={handleReset} className="btn-secondary w-full cursor-pointer">
                Convert Another File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
