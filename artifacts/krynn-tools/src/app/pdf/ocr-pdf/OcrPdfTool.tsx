import { useState, useCallback, useRef } from "react";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "rus", label: "Russian" },
  { code: "jpn", label: "Japanese" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "chi_tra", label: "Chinese (Traditional)" },
  { code: "kor", label: "Korean" },
  { code: "ara", label: "Arabic" },
  { code: "hin", label: "Hindi" },
  { code: "nld", label: "Dutch" },
  { code: "swe", label: "Swedish" },
  { code: "pol", label: "Polish" },
  { code: "tur", label: "Turkish" },
  { code: "vie", label: "Vietnamese" },
  { code: "tha", label: "Thai" },
  { code: "ind", label: "Indonesian" },
];

interface ProgressInfo {
  currentPage: number;
  totalPages: number;
  percent: number;
  status: string;
}

export default function OcrPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(false);

  const handleFile = useCallback((f: File) => {
    const isPdf = f.type === "application/pdf";
    const isImage = f.type.startsWith("image/");
    if (!isPdf && !isImage) {
      setError("Please upload a PDF file or an image (JPG, PNG, WebP).");
      return;
    }
    setError("");
    setFile(f);
    setExtractedText("");
    setProgress(null);
  }, []);

  const processFile = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setExtractedText("");
    abortRef.current = false;

    try {
      const isPdf = file.type === "application/pdf";
      let imageBlobs: Blob[] = [];

      if (isPdf) {
        setProgress({ currentPage: 0, totalPages: 0, percent: 0, status: "Loading PDF..." });
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          if (abortRef.current) break;
          setProgress({ currentPage: i, totalPages, percent: Math.round(((i - 1) / totalPages) * 100), status: `Rendering page ${i} of ${totalPages}...` });

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, canvas, viewport }).promise;

          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/png")
          );
          imageBlobs.push(blob);
        }
      } else {
        imageBlobs = [file];
      }

      if (abortRef.current) {
        setProcessing(false);
        return;
      }

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(language, undefined, {
        logger: (m) => {
          if (m.status === "recognizing text" && progress) {
            const pageProgress = Math.round(m.progress * 100);
            setProgress((prev) =>
              prev
                ? { ...prev, percent: Math.round(((prev.currentPage - 1) / prev.totalPages) * 100 + pageProgress / prev.totalPages), status: `OCR page ${prev.currentPage} of ${prev.totalPages}... ${pageProgress}%` }
                : prev
            );
          }
        },
      });

      const texts: string[] = [];
      for (let i = 0; i < imageBlobs.length; i++) {
        if (abortRef.current) break;
        setProgress({
          currentPage: i + 1,
          totalPages: imageBlobs.length,
          percent: Math.round(((i) / imageBlobs.length) * 100),
          status: `OCR processing page ${i + 1} of ${imageBlobs.length}...`,
        });

        const { data } = await worker.recognize(imageBlobs[i]);
        texts.push(data.text);
      }

      await worker.terminate();

      if (abortRef.current) {
        setProcessing(false);
        return;
      }

      const fullText = texts.join("\n\n--- Page Break ---\n\n").trim();
      if (!fullText) {
        setError("No text was detected in the document. The file may be purely graphical or the image quality may be too low.");
      }
      setExtractedText(fullText);
      setProgress({ currentPage: imageBlobs.length, totalPages: imageBlobs.length, percent: 100, status: "Complete!" });
    } catch (err) {
      console.error("OCR Error:", err);
      setError("An error occurred while processing the file. It may be corrupted or too large. Please try a different file.");
    } finally {
      setProcessing(false);
    }
  }, [file, language, progress]);

  const handleCopy = useCallback(async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = extractedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [extractedText]);

  const handleDownload = useCallback(() => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}-ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [extractedText, file]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setFile(null);
    setExtractedText("");
    setProgress(null);
    setError("");
    setProcessing(false);
  }, []);

  return (
    <ToolLayout
      title="OCR PDF — Extract Text from Scanned PDFs"
      subtitle="Extract text from scanned PDFs and images using OCR. 100% client-side — your files never leave your device."
      howToUse={[
        "Upload a scanned PDF or image file using the drop zone below.",
        "Select the document language for accurate text recognition.",
        "Click 'Extract Text' and watch the progress as each page is processed.",
        "Copy the extracted text to your clipboard or download it as a .txt file.",
      ]}
      faq={[
        {
          question: "What is OCR?",
          answer: "OCR (Optical Character Recognition) is technology that recognizes text in images and scanned documents, converting them into searchable, editable text.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All OCR processing happens entirely in your browser using tesseract.js. Your scanned documents never leave your device, ensuring complete privacy.",
        },
        {
          question: "Which languages are supported?",
          answer: "Tesseract.js supports over 100 languages. We provide quick selection for 20+ common languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and Hindi.",
        },
        {
          question: "Why is OCR slow?",
          answer: "OCR is computationally intensive as it analyzes every pixel of each page to identify characters. Processing speed depends on your device and the document complexity. Larger documents with more pages will take longer.",
        },
        {
          question: "What file formats are supported?",
          answer: "You can upload PDF files as well as image formats including JPG, PNG, and WebP. For PDFs, each page is converted to an image before OCR processing.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onFile={handleFile}
            label="Drag & drop a scanned PDF or image here"
          />
        )}

        {file && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                  <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!processing && (
                <button
                  onClick={handleReset}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-destructive)] transition-colors duration-200 hover:bg-[var(--color-muted)]"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
                Document Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={processing}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {!processing && !extractedText && (
              <button onClick={processFile} className="btn-primary w-full">
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Extract Text
                </span>
              </button>
            )}
          </div>
        )}

        {processing && progress && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                {progress.status}
              </span>
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {progress.percent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-[var(--color-muted-foreground)]">
              <span>
                {progress.totalPages > 0
                  ? `Page ${progress.currentPage} of ${progress.totalPages}`
                  : "Preparing..."}
              </span>
              <button
                onClick={() => {
                  abortRef.current = true;
                }}
                className="cursor-pointer font-medium text-[var(--color-destructive)] hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {extractedText && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                  Extracted Text
                </h3>
                <span className="text-xs text-[var(--color-muted-foreground)]">
                  {extractedText.length.toLocaleString()} characters
                </span>
              </div>
              <textarea
                readOnly
                value={extractedText}
                className="h-64 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4 font-mono text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleCopy} className="btn-primary flex-1">
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Text
                  </span>
                )}
              </button>
              <button onClick={handleDownload} className="btn-secondary flex-1">
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download .txt
                </span>
              </button>
            </div>

            <button onClick={handleReset} className="btn-secondary w-full">
              Process Another File
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
