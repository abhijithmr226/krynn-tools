import { useState, useCallback } from "react";
import { FileDropZone } from "@/components/ToolLayout";

const LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "rus", name: "Russian" },
  { code: "jpn", name: "Japanese" },
  { code: "chi_sim", name: "Chinese Simplified" },
  { code: "chi_tra", name: "Chinese Traditional" },
  { code: "kor", name: "Korean" },
  { code: "ara", name: "Arabic" },
  { code: "hin", name: "Hindi" },
  { code: "nld", name: "Dutch" },
  { code: "swe", name: "Swedish" },
  { code: "pol", name: "Polish" },
  { code: "tur", name: "Turkish" },
  { code: "vie", name: "Vietnamese" },
  { code: "tha", name: "Thai" },
  { code: "ind", name: "Indonesian" },
];

export default function OcrImageToTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [language, setLanguage] = useState("eng");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|png|webp|bmp)$/)) {
      setError("Please upload a JPG, PNG, WebP, or BMP image.");
      return;
    }
    setError("");
    setFile(f);
    setResult("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(f);
  }, []);

  const extractText = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setStatusText("Initializing OCR engine...");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(language, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Recognizing text... ${Math.round(m.progress * 100)}%`);
          } else if (m.status === "loading tesseract core") {
            setProgress(Math.round(m.progress * 10));
            setStatusText("Loading OCR core...");
          } else if (m.status === "initializing tesseract") {
            setProgress(Math.round(m.progress * 10) + 10);
            setStatusText("Initializing OCR engine...");
          } else if (m.status === "loading language traineddata") {
            setProgress(Math.round(m.progress * 15) + 15);
            setStatusText("Loading language data...");
          }
        },
      });
      const { data } = await worker.recognize(preview);
      setResult(data.text);
      await worker.terminate();
    } catch {
      setError("Failed to extract text. Please try again with a clearer image.");
    } finally {
      setLoading(false);
      setProgress(0);
      setStatusText("");
    }
  }, [file, language, preview]);

  const copyToClipboard = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  }, [result]);

  const downloadTxt = useCallback(() => {
    if (!result || !file) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}-ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview("");
    setResult("");
    setError("");
    setLoading(false);
    setProgress(0);
    setStatusText("");
    setCopied(false);
  }, []);

  return (
    <div className="space-y-6">
      {!file && (
        <FileDropZone accept=".jpg,.jpeg,.png,.webp,.bmp" onFile={handleFile} />
      )}

      {file && !result && !loading && (
        <>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
              <button
                onClick={reset}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                Remove
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-72 rounded-md object-contain"
              />
            </div>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <label
              htmlFor="ocr-language"
              className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]"
            >
              Document Language
            </label>
            <select
              id="ocr-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm font-medium text-[var(--color-destructive)]">
              {error}
            </p>
          )}

          <button
            onClick={extractText}
            disabled={loading}
            className="btn-primary w-full cursor-pointer"
          >
            Extract Text
          </button>
        </>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-2 flex justify-between text-sm text-[var(--color-foreground)]">
              <span>{statusText}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[var(--color-muted-foreground)]">
            <span className="spinner" />
            <span className="text-sm">Processing image, please wait...</span>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                Extracted Text
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {result.length.toLocaleString()} characters
              </p>
            </div>
            <textarea
              readOnly
              value={result}
              className="h-64 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] font-mono"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={copyToClipboard}
              className="btn-primary flex-1 cursor-pointer"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={downloadTxt}
              className="btn-secondary flex-1 cursor-pointer"
            >
              Download as .txt
            </button>
          </div>

          <button
            onClick={reset}
            className="btn-secondary w-full cursor-pointer"
          >
            Process Another Image
          </button>
        </div>
      )}
    </div>
  );
}
