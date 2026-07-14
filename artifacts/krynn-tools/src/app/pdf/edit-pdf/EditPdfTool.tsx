import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type ToolMode = "select" | "text" | "image" | "rectangle" | "line" | "highlight" | "whiteout" | "signature" | "circle";

interface EditorElement {
  id: string;
  type: ToolMode;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineWidth?: number;
  lineColor?: string;
  fillColor?: string;
  opacity?: number;
  imageData?: string;
  imageFile?: File;
  rotation?: number;
  endX?: number;
  endY?: number;
}

interface PageInfo {
  width: number;
  height: number;
  scale: number;
}

const TOOLBAR: { mode: ToolMode; label: string; icon: string }[] = [
  { mode: "select", label: "Select", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" },
  { mode: "text", label: "Text", icon: "M4 6h16M8 6v12m4-12v12m4-8v8" },
  { mode: "image", label: "Image", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { mode: "rectangle", label: "Rectangle", icon: "M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" },
  { mode: "circle", label: "Circle", icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" },
  { mode: "line", label: "Line", icon: "M4 20L20 4" },
  { mode: "highlight", label: "Highlight", icon: "M15.243 2.486l4.257 4.257-9.193 9.193-5.683 1.43 1.43-5.683 9.192-9.194z" },
  { mode: "whiteout", label: "Whiteout", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { mode: "signature", label: "Signature", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
];

const COLORS = ["#000000", "#FF0000", "#0000FF", "#00AA00", "#FF6600", "#9900CC", "#FFFFFF"];
const HIGHLIGHT_COLORS = ["#FFFF00", "#00FF00", "#FF00FF", "#00FFFF", "#FF9900", "#99CCFF"];

export default function EditPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfos, setPageInfos] = useState<PageInfo[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [activeTool, setActiveTool] = useState<ToolMode>("select");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [zoom, setZoom] = useState(1);

  const [text, setText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [lineWidth, setLineWidth] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#FFFF00");
  const [opacity, setOpacity] = useState(1);
  const [shapeFill, setShapeFill] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const renderedPages = useRef<Map<number, string>>(new Map());
  const [renderTick, setRenderTick] = useState(0);

  const renderPage = useCallback(async (pageIndex: number, scale: number) => {
    const cacheKey = `${pageIndex}-${scale}`;
    if (renderedPages.current.has(cacheKey)) return renderedPages.current.get(cacheKey)!;
    if (!file) return null;
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, canvas, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");
      renderedPages.current.set(cacheKey, dataUrl);
      return dataUrl;
    } catch {
      return null;
    }
  }, [file]);

  const renderCurrentPage = useCallback(async () => {
    const info = pageInfos[currentPage];
    if (!info) return;
    const dataUrl = await renderPage(currentPage, info.scale * zoom);
    if (dataUrl) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        setRenderTick((t) => t + 1);
      };
      img.src = dataUrl;
    }
  }, [currentPage, pageInfos, zoom, renderPage]);

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setSuccess("");
    setFile(f);
    setElements([]);
    setCurrentPage(0);
    setSelectedElement(null);
    renderedPages.current.clear();
    try {
      const bytes = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setPageOrder(Array.from({ length: count }, (_, i) => i));
      const infos: PageInfo[] = [];
      for (let i = 0; i < count; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const baseScale = Math.min(1, 600 / Math.max(width, height));
        infos.push({ width, height, scale: baseScale });
      }
      setPageInfos(infos);
    } catch {
      setError("Failed to read PDF. The file may be corrupted.");
    }
  }, []);

  useEffect(() => {
    if (file && pageInfos.length > 0) {
      renderCurrentPage();
    }
  }, [currentPage, file, pageInfos, renderCurrentPage, renderTick, elements]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const getPdfCoords = useCallback((canvasX: number, canvasY: number): { x: number; y: number } => {
    const info = pageInfos[currentPage];
    if (!info) return { x: 0, y: 0 };
    const scale = info.scale * zoom;
    const pdfX = canvasX / scale;
    const pdfY = (info.height * info.scale * zoom - canvasY) / scale;
    return { x: pdfX, y: pdfY };
  }, [currentPage, pageInfos, zoom]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const pdfCoords = getPdfCoords(coords.x, coords.y);

    if (activeTool === "select") {
      const clicked = [...elements].reverse().find(
        (el) => el.pageIndex === currentPage && isPointInElement(pdfCoords.x, pdfCoords.y, el)
      );
      setSelectedElement(clicked?.id ?? null);
      return;
    }

    if (activeTool === "text") {
      const newEl: EditorElement = {
        id: `el-${Date.now()}`,
        type: "text",
        pageIndex: currentPage,
        x: pdfCoords.x,
        y: pdfCoords.y,
        width: 200,
        height: fontSize * 1.5,
        text,
        fontSize,
        fontColor,
        fontWeight,
        fontStyle,
        opacity,
      };
      setElements((prev) => [...prev, newEl]);
      return;
    }

    setIsDrawing(true);
    setDrawStart(pdfCoords);
  }, [activeTool, currentPage, elements, getCanvasCoords, getPdfCoords, text, fontSize, fontColor, fontWeight, fontStyle, opacity]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return;
    const coords = getCanvasCoords(e);
    const pdfCoords = getPdfCoords(coords.x, coords.y);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCurrentPage().then(() => {
      const c = canvasRef.current;
      if (!c) return;
      const context = c.getContext("2d");
      if (!context) return;
      context.strokeStyle = lineColor;
      context.fillStyle = fillColor;
      context.lineWidth = lineWidth;
      context.globalAlpha = opacity;
      const sx = drawStart.x * (pageInfos[currentPage]?.scale ?? 1) * zoom;
      const sy = (pageInfos[currentPage]?.height ?? 0) * (pageInfos[currentPage]?.scale ?? 1) * zoom - drawStart.y * (pageInfos[currentPage]?.scale ?? 1) * zoom;
      const ex = pdfCoords.x * (pageInfos[currentPage]?.scale ?? 1) * zoom;
      const ey = (pageInfos[currentPage]?.height ?? 0) * (pageInfos[currentPage]?.scale ?? 1) * zoom - pdfCoords.y * (pageInfos[currentPage]?.scale ?? 1) * zoom;
      const w = ex - sx;
      const h = ey - sy;
      if (activeTool === "rectangle" || activeTool === "highlight" || activeTool === "whiteout") {
        if (shapeFill || activeTool === "highlight" || activeTool === "whiteout") {
          context.fillRect(sx, sy, w, h);
        }
        context.strokeRect(sx, sy, w, h);
      } else if (activeTool === "circle") {
        context.beginPath();
        const rx = Math.abs(w) / 2;
        const ry = Math.abs(h) / 2;
        const cx = sx + w / 2;
        const cy = sy + h / 2;
        context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (shapeFill) context.fill();
        context.stroke();
      } else if (activeTool === "line") {
        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(ex, ey);
        context.stroke();
      }
      context.globalAlpha = 1;
    });
  }, [isDrawing, drawStart, activeTool, getCanvasCoords, getPdfCoords, lineColor, fillColor, lineWidth, opacity, shapeFill, currentPage, pageInfos, zoom, renderCurrentPage]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return;
    const coords = getCanvasCoords(e);
    const pdfCoords = getPdfCoords(coords.x, coords.y);
    const x = Math.min(drawStart.x, pdfCoords.x);
    const y = Math.min(drawStart.y, pdfCoords.y);
    const w = Math.abs(pdfCoords.x - drawStart.x);
    const h = Math.abs(pdfCoords.y - drawStart.y);
    if (w < 3 && h < 3) {
      setIsDrawing(false);
      setDrawStart(null);
      return;
    }
    const newEl: EditorElement = {
      id: `el-${Date.now()}`,
      type: activeTool,
      pageIndex: currentPage,
      x,
      y,
      width: w,
      height: h,
      lineWidth,
      lineColor: activeTool === "whiteout" ? "#FFFFFF" : lineColor,
      fillColor: activeTool === "whiteout" ? "#FFFFFF" : activeTool === "highlight" ? fillColor : shapeFill ? fillColor : "transparent",
      opacity: activeTool === "highlight" ? 0.4 : opacity,
      endX: pdfCoords.x,
      endY: pdfCoords.y,
    };
    setElements((prev) => [...prev, newEl]);
    setIsDrawing(false);
    setDrawStart(null);
  }, [isDrawing, drawStart, activeTool, currentPage, getCanvasCoords, getPdfCoords, lineWidth, lineColor, fillColor, opacity, shapeFill]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const info = pageInfos[currentPage];
        if (!info) return;
        const maxW = info.width * 0.5;
        const scale = maxW / (img.width / (info.scale * zoom));
        const w = img.width * scale / (info.scale * zoom);
        const h = img.height * scale / (info.scale * zoom);
        const newEl: EditorElement = {
          id: `el-${Date.now()}`,
          type: "image",
          pageIndex: currentPage,
          x: info.width * 0.1,
          y: info.height * 0.5,
          width: Math.min(w, info.width * 0.5),
          height: Math.min(h, info.height * 0.5),
          imageData: dataUrl,
          opacity,
        };
        setElements((prev) => [...prev, newEl]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  }, [currentPage, pageInfos, zoom, opacity]);

  const handleSignatureUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const info = pageInfos[currentPage];
      if (!info) return;
      const newEl: EditorElement = {
        id: `el-${Date.now()}`,
        type: "signature",
        pageIndex: currentPage,
        x: info.width * 0.3,
        y: info.height * 0.15,
        width: 150,
        height: 50,
        imageData: dataUrl,
        opacity,
      };
      setElements((prev) => [...prev, newEl]);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  }, [currentPage, pageInfos, opacity]);

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElement(null);
  }, []);

  const duplicateElement = useCallback((id: string) => {
    setElements((prev) => {
      const el = prev.find((e) => e.id === id);
      if (!el) return prev;
      return [...prev, { ...el, id: `el-${Date.now()}`, x: el.x + 20, y: el.y - 20 }];
    });
  }, []);

  const moveElementUp = useCallback((id: string) => {
    setElements((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const moveElementDown = useCallback((id: string) => {
    setElements((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  }, []);

  const deletePage = useCallback((pageIndex: number) => {
    if (pageCount <= 1) return;
    setElements((prev) => prev.filter((el) => el.pageIndex !== pageIndex));
    setPageOrder((prev) => prev.filter((_, i) => i !== pageIndex));
    setPageCount((prev) => prev - 1);
    setPageInfos((prev) => prev.filter((_, i) => i !== pageIndex));
    if (currentPage >= pageCount - 1) setCurrentPage(Math.max(0, pageCount - 2));
  }, [currentPage, pageCount]);

  const rotatePage = useCallback((pageIndex: number) => {
    setPageInfos((prev) => {
      const next = [...prev];
      const info = { ...next[pageIndex] };
      info.width = info.height;
      info.height = info.width;
      next[pageIndex] = info;
      return next;
    });
    setElements((prev) => prev.map((el) => {
      if (el.pageIndex !== pageIndex) return el;
      return { ...el, rotation: ((el.rotation ?? 0) + 90) % 360 };
    }));
  }, []);

  const movePage = useCallback((from: number, to: number) => {
    if (to < 0 || to >= pageCount) return;
    setPageOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setElements((prev) => prev.map((el) => {
      if (el.pageIndex === from) return { ...el, pageIndex: to };
      if (from < to && el.pageIndex > from && el.pageIndex <= to) return { ...el, pageIndex: el.pageIndex - 1 };
      if (from > to && el.pageIndex >= to && el.pageIndex < from) return { ...el, pageIndex: el.pageIndex + 1 };
      return el;
    }));
    setCurrentPage(to);
  }, [pageCount]);

  const exportPdf = useCallback(async () => {
    if (!file) return;
    setExporting(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await doc.embedFont(StandardFonts.HelveticaOblique);
      const boldItalicFont = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

      for (const el of elements) {
        if (el.pageIndex >= doc.getPageCount()) continue;
        const page = doc.getPage(el.pageIndex);
        const { height } = page.getSize();

        if (el.type === "text") {
          const r = parseInt(el.fontColor?.slice(1, 3) ?? "00", 16) / 255;
          const g = parseInt(el.fontColor?.slice(3, 5) ?? "00", 16) / 255;
          const b = parseInt(el.fontColor?.slice(5, 7) ?? "00", 16) / 255;
          let useFont = font;
          if (el.fontWeight === "bold" && el.fontStyle === "italic") useFont = boldItalicFont;
          else if (el.fontWeight === "bold") useFont = boldFont;
          else if (el.fontStyle === "italic") useFont = italicFont;
          page.drawText(el.text ?? "Text", {
            x: el.x,
            y: height - el.y - (el.fontSize ?? 16),
            size: el.fontSize ?? 16,
            font: useFont,
            color: rgb(r, g, b),
            opacity: el.opacity ?? 1,
          });
        } else if (el.type === "rectangle") {
          const r = parseInt(el.lineColor?.slice(1, 3) ?? "00", 16) / 255;
          const g = parseInt(el.lineColor?.slice(3, 5) ?? "00", 16) / 255;
          const b = parseInt(el.lineColor?.slice(5, 7) ?? "00", 16) / 255;
          page.drawRectangle({
            x: el.x,
            y: height - el.y - el.height,
            width: el.width,
            height: el.height,
            borderColor: rgb(r, g, b),
            borderWidth: el.lineWidth ?? 2,
            opacity: el.opacity ?? 1,
          });
        } else if (el.type === "circle") {
          const r = parseInt(el.lineColor?.slice(1, 3) ?? "00", 16) / 255;
          const g = parseInt(el.lineColor?.slice(3, 5) ?? "00", 16) / 255;
          const b = parseInt(el.lineColor?.slice(5, 7) ?? "00", 16) / 255;
          page.drawEllipse({
            x: el.x + el.width / 2,
            y: height - el.y - el.height / 2,
            xScale: el.width / 2,
            yScale: el.height / 2,
            borderColor: rgb(r, g, b),
            borderWidth: el.lineWidth ?? 2,
            opacity: el.opacity ?? 1,
          });
        } else if (el.type === "line") {
          const r = parseInt(el.lineColor?.slice(1, 3) ?? "00", 16) / 255;
          const g = parseInt(el.lineColor?.slice(3, 5) ?? "00", 16) / 255;
          const b = parseInt(el.lineColor?.slice(5, 7) ?? "00", 16) / 255;
          page.drawLine({
            start: { x: el.x, y: height - el.y },
            end: { x: el.endX ?? el.x + el.width, y: height - (el.endY ?? el.y) },
            thickness: el.lineWidth ?? 2,
            color: rgb(r, g, b),
            opacity: el.opacity ?? 1,
          });
        } else if (el.type === "highlight") {
          const r = parseInt(el.fillColor?.slice(1, 3) ?? "FF", 16) / 255;
          const g = parseInt(el.fillColor?.slice(3, 5) ?? "FF", 16) / 255;
          const b = parseInt(el.fillColor?.slice(5, 7) ?? "00", 16) / 255;
          page.drawRectangle({
            x: el.x,
            y: height - el.y - el.height,
            width: el.width,
            height: el.height,
            color: rgb(r, g, b),
            opacity: 0.4,
          });
        } else if (el.type === "whiteout") {
          page.drawRectangle({
            x: el.x,
            y: height - el.y - el.height,
            width: el.width,
            height: el.height,
            color: rgb(1, 1, 1),
            opacity: 1,
          });
        } else if ((el.type === "image" || el.type === "signature") && el.imageData) {
          try {
            const response = await fetch(el.imageData);
            const imgBlob = await response.blob();
            const imgBytes = await imgBlob.arrayBuffer();
            let embedded;
            if (el.imageData.includes("image/png")) {
              embedded = await doc.embedPng(imgBytes);
            } else {
              embedded = await doc.embedJpg(imgBytes);
            }
            page.drawImage(embedded, {
              x: el.x,
              y: height - el.y - el.height,
              width: el.width,
              height: el.height,
              opacity: el.opacity ?? 1,
            });
          } catch { /* skip broken images */ }
        }
      }

      const modified = await doc.save();
      const blob = new Blob([new Uint8Array(modified)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess("PDF exported successfully!");
    } catch {
      setError("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [file, elements]);

  const currentElements = useMemo(() =>
    elements.filter((el) => el.pageIndex === currentPage),
    [elements, currentPage]
  );

  const reset = useCallback(() => {
    setFile(null);
    setElements([]);
    setCurrentPage(0);
    setPageCount(0);
    setPageInfos([]);
    setPageOrder([]);
    setSelectedElement(null);
    setError("");
    setSuccess("");
    renderedPages.current.clear();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
          className="drop-zone"
        >
          <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="pdf-edit-upload" />
          <label htmlFor="pdf-edit-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Drag & drop your PDF to edit</p>
                <p className="mt-1.5 text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <p className="text-xs text-muted-foreground">Supports: PDF</p>
            </div>
          </label>
        </div>
      )}

      {file && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-48 shrink-0 space-y-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Pages</span>
                <span className="text-xs text-[var(--color-muted-foreground)]">{pageCount}</span>
              </div>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {Array.from({ length: pageCount }, (_, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer transition-colors ${currentPage === i ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"}`}
                    onClick={() => setCurrentPage(i)}
                  >
                    <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 bg-black/10">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] truncate block">Page {i + 1}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {i > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); movePage(i, i - 1); }} className="w-4 h-4 rounded flex items-center justify-center hover:bg-black/10 text-[8px]" title="Move up">&#9650;</button>
                      )}
                      {i < pageCount - 1 && (
                        <button onClick={(e) => { e.stopPropagation(); movePage(i, i + 1); }} className="w-4 h-4 rounded flex items-center justify-center hover:bg-black/10 text-[8px]" title="Move down">&#9660;</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--color-border)] space-y-1">
                <button onClick={() => rotatePage(currentPage)} className="w-full text-[10px] font-medium py-1 rounded bg-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors">Rotate Page</button>
                {pageCount > 1 && (
                  <button onClick={() => deletePage(currentPage)} className="w-full text-[10px] font-medium py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-950 dark:text-red-400">Delete Page</button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2">
              <div className="flex items-center gap-1 flex-wrap">
                {TOOLBAR.map((tool) => (
                  <button
                    key={tool.mode}
                    onClick={() => {
                      setActiveTool(tool.mode);
                      if (tool.mode === "image") imageInputRef.current?.click();
                      if (tool.mode === "signature") signatureInputRef.current?.click();
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTool === tool.mode ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"}`}
                    title={tool.label}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                    </svg>
                    <span className="hidden sm:inline">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <input ref={signatureInputRef} type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Page {currentPage + 1}</span>
                  <span className="text-[10px] text-[var(--color-muted-foreground)]">({pageInfos[currentPage]?.width.toFixed(0)} x {pageInfos[currentPage]?.height.toFixed(0)} pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} className="w-6 h-6 rounded flex items-center justify-center bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-xs font-bold">-</button>
                  <span className="text-[10px] font-medium text-[var(--color-muted-foreground)] w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="w-6 h-6 rounded flex items-center justify-center bg-[var(--color-muted)] hover:bg-[var(--color-border)] text-xs font-bold">+</button>
                </div>
              </div>
              <div ref={containerRef} className="relative overflow-auto max-h-[500px] rounded border border-[var(--color-border)] bg-white flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full cursor-crosshair"
                  style={{ display: "block" }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                />
                {currentElements.map((el) => {
                  const info = pageInfos[currentPage];
                  if (!info) return null;
                  const scale = info.scale * zoom;
                  const canvasY = info.height * scale - (el.y + el.height) * scale;
                  const cssStyle: React.CSSProperties = {
                    position: "absolute",
                    left: el.x * scale,
                    top: canvasY,
                    width: el.width * scale,
                    height: el.height * scale,
                    pointerEvents: activeTool === "select" ? "auto" : "none",
                    cursor: activeTool === "select" ? "move" : "crosshair",
                    border: selectedElement === el.id ? "2px dashed var(--color-primary)" : "1px dashed rgba(0,0,0,0.2)",
                    opacity: el.opacity ?? 1,
                  };
                  if (el.type === "text") {
                    return (
                      <div
                        key={el.id}
                        style={{
                          ...cssStyle,
                          fontSize: (el.fontSize ?? 16) * scale,
                          color: el.fontColor,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          padding: "2px",
                          background: selectedElement === el.id ? "rgba(59,130,246,0.05)" : "transparent",
                        }}
                        onClick={() => setSelectedElement(el.id)}
                      >
                        {el.text}
                      </div>
                    );
                  }
                  if (el.type === "image" || el.type === "signature") {
                    return (
                      <img
                        key={el.id}
                        src={el.imageData}
                        alt={el.type}
                        style={cssStyle}
                        className="object-contain"
                        onClick={() => setSelectedElement(el.id)}
                        draggable={false}
                      />
                    );
                  }
                  if (el.type === "highlight") {
                    return (
                      <div
                        key={el.id}
                        style={{
                          ...cssStyle,
                          backgroundColor: el.fillColor,
                          border: selectedElement === el.id ? "2px dashed var(--color-primary)" : "none",
                        }}
                        onClick={() => setSelectedElement(el.id)}
                      />
                    );
                  }
                  if (el.type === "whiteout") {
                    return (
                      <div
                        key={el.id}
                        style={{
                          ...cssStyle,
                          backgroundColor: "#FFFFFF",
                          border: selectedElement === el.id ? "2px dashed var(--color-primary)" : "none",
                        }}
                        onClick={() => setSelectedElement(el.id)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
              <p className="mt-1.5 text-[10px] text-[var(--color-muted-foreground)] text-center">
                {activeTool === "select" ? "Click an element to select it" : activeTool === "text" ? "Click on the page to add text" : "Click and drag to draw on the page"}
              </p>
            </div>
          </div>

          <div className="lg:w-64 shrink-0 space-y-3">
            {(activeTool === "text" || activeTool === "rectangle" || activeTool === "circle" || activeTool === "line" || activeTool === "highlight" || activeTool === "whiteout" || activeTool === "signature") && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Tool Options</span>
                {activeTool === "text" && (
                  <>
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Text</label>
                      <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1.5 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Size: {fontSize}pt</label>
                      <input type="range" min={8} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")} className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors ${fontWeight === "bold" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)]"}`}>B</button>
                      <button onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")} className={`flex-1 py-1 rounded text-[10px] italic transition-colors ${fontStyle === "italic" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)]"}`}>I</button>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Color</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {COLORS.map((c) => (
                          <button key={c} onClick={() => setFontColor(c)} className="w-5 h-5 rounded-full border border-[var(--color-border)]" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {(activeTool === "rectangle" || activeTool === "circle" || activeTool === "line") && (
                  <>
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Stroke Color</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {COLORS.filter((c) => c !== "#FFFFFF").map((c) => (
                          <button key={c} onClick={() => setLineColor(c)} className={`w-5 h-5 rounded-full border-2 ${lineColor === c ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    {activeTool !== "line" && (
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={shapeFill} onChange={(e) => setShapeFill(e.target.checked)} className="accent-[var(--color-primary)]" />
                        <label className="text-[10px] font-medium text-[var(--color-muted-foreground)]">Fill shape</label>
                        {shapeFill && (
                          <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0" />
                        )}
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Width: {lineWidth}px</label>
                      <input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
                    </div>
                  </>
                )}
                {activeTool === "highlight" && (
                  <>
                    <div>
                      <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Highlight Color</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {HIGHLIGHT_COLORS.map((c) => (
                          <button key={c} onClick={() => setFillColor(c)} className={`w-5 h-5 rounded-full border-2 ${fillColor === c ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTool === "whiteout" && (
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">Draw over any area to cover it with a white rectangle.</p>
                )}
                {activeTool !== "highlight" && activeTool !== "whiteout" && (
                  <div>
                    <label className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                    <input type="range" min={10} max={100} value={Math.round(opacity * 100)} onChange={(e) => setOpacity(Number(e.target.value) / 100)} className="w-full accent-[var(--color-primary)]" />
                  </div>
                )}
              </div>
            )}

            {selectedElement && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Selected Element</span>
                <div className="flex gap-1.5">
                  <button onClick={() => duplicateElement(selectedElement)} className="flex-1 text-[10px] font-medium py-1.5 rounded bg-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors">Duplicate</button>
                  <button onClick={() => { moveElementUp(selectedElement); }} className="flex-1 text-[10px] font-medium py-1.5 rounded bg-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors">Layer Up</button>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { moveElementDown(selectedElement); }} className="flex-1 text-[10px] font-medium py-1.5 rounded bg-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors">Layer Down</button>
                  <button onClick={() => removeElement(selectedElement)} className="flex-1 text-[10px] font-medium py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-950 dark:text-red-400">Delete</button>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Elements ({elements.length})</span>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {elements.length === 0 && (
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">No elements added yet.</p>
                )}
                {elements.map((el) => (
                  <div
                    key={el.id}
                    className={`flex items-center gap-1.5 p-1.5 rounded text-[10px] cursor-pointer transition-colors ${selectedElement === el.id ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30" : "bg-[var(--color-muted)] hover:bg-[var(--color-border)]"}`}
                    onClick={() => { setSelectedElement(el.id); setCurrentPage(el.pageIndex); }}
                  >
                    <span className="font-medium capitalize">{el.type}</span>
                    <span className="text-[var(--color-muted-foreground)]">p{el.pageIndex + 1}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="ml-auto text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                <p className="text-xs font-medium text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">{success}</p>
              </div>
            )}

            <button onClick={exportPdf} disabled={exporting || elements.length === 0} className="btn-primary w-full cursor-pointer disabled:opacity-50">
              {exporting ? (
                <span className="flex items-center justify-center gap-2"><span className="spinner" /> Exporting...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Edited PDF
                </span>
              )}
            </button>

            <button onClick={reset} className="btn-secondary w-full cursor-pointer text-sm">
              Edit Another PDF
            </button>

            {file && (
              <div className="text-center">
                <p className="text-[10px] text-[var(--color-muted-foreground)]">{file.name} ({formatSize(file.size)})</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function isPointInElement(x: number, y: number, el: EditorElement): boolean {
  return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
}
