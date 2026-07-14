import { useState, useCallback, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function SignPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [sigWidth, setSigWidth] = useState(150);
  const [sigHeight, setSigHeight] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Failed to read PDF. The file may be corrupted.");
    }
  }, []);

  const handleSignatureImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (PNG or JPG).");
      return;
    }
    setSignatureFile(f);
    setError("");
    const reader = new FileReader();
    reader.onload = () => setSignatureImage(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const process = async () => {
    if (!file || !signatureImage || !signatureFile) {
      setError("Please upload a PDF and a signature image.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const imgBytes = await signatureFile.arrayBuffer();

      let embeddedImg;
      if (signatureFile.type === "image/png") {
        embeddedImg = await doc.embedPng(imgBytes);
      } else {
        embeddedImg = await doc.embedJpg(imgBytes);
      }

      const page = doc.getPage(selectedPage);
      page.drawImage(embeddedImg, {
        x: posX,
        y: posY,
        width: sigWidth,
        height: sigHeight,
      });

      const modified = await doc.save();
      setResult(new Blob([new Uint8Array(modified)], { type: "application/pdf" }));
    } catch {
      setError("Failed to sign PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Sign PDF Online Free"
      subtitle="Add a signature image overlay to any page of your PDF document."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone.",
        "Upload your signature image (PNG with transparent background works best).",
        "Select the page, position (X, Y), and size for your signature.",
        "Click Sign PDF and download your signed document.",
      ]}
      faq={[
        {
          question: "What image formats are supported for signatures?",
          answer: "You can use PNG or JPG images. PNG with a transparent background is recommended for the best results as it blends naturally with the document.",
        },
        {
          question: "Can I place the signature on a specific page?",
          answer: "Yes. After uploading your PDF, you can select which page to place the signature on using the page selector.",
        },
        {
          question: "How do I position the signature?",
          answer: "You can set the X and Y coordinates in PDF points (72 points = 1 inch). Adjust the width and height to resize the signature overlay.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All processing happens locally in your browser using pdf-lib. Your files never leave your device.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your PDF here" />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{pageCount} pages</p>
                </div>
                <button
                  onClick={() => { setFile(null); setResult(null); setPageCount(0); setSignatureImage(null); setSignatureFile(null); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Signature Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleSignatureImage}
                className="hidden"
                id="signature-upload"
              />
              {signatureImage ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                    <p className="text-sm text-[var(--color-foreground)]">{signatureFile?.name}</p>
                    <button
                      onClick={() => { setSignatureImage(null); setSignatureFile(null); }}
                      className="cursor-pointer text-sm text-[var(--color-destructive)] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-center rounded-md border border-[var(--color-border)] bg-white p-4 dark:shadow-lg">
                    <img src={signatureImage} alt="Signature preview" className="max-h-24 object-contain" />
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="signature-upload"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-[var(--color-border)] p-6 text-center hover:border-[var(--color-primary)] transition-colors duration-200"
                >
                  <svg className="h-8 w-8 text-[var(--color-muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--color-foreground)]">Upload signature image</span>
                  <span className="text-xs text-[var(--color-muted-foreground)]">PNG with transparent background recommended</span>
                </label>
              )}
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Page</label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPage(i)}
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      selectedPage === i
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">Position & Size (points)</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">X Position</label>
                  <input
                    type="number"
                    min={0}
                    value={posX}
                    onChange={(e) => setPosX(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">Y Position</label>
                  <input
                    type="number"
                    min={0}
                    value={posY}
                    onChange={(e) => setPosY(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">Width</label>
                  <input
                    type="number"
                    min={10}
                    value={sigWidth}
                    onChange={(e) => setSigWidth(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-muted-foreground)]">Height</label>
                  <input
                    type="number"
                    min={10}
                    value={sigHeight}
                    onChange={(e) => setSigHeight(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                72 points = 1 inch. Default positions the signature at the bottom-left area.
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading || !signatureImage} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Signing...</span> : "Sign PDF"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Signature added to page {selectedPage + 1} successfully
              </p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Signed PDF
            </button>
            <button onClick={() => { setResult(null); setError(""); }} className="btn-secondary w-full cursor-pointer">
              Sign Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
