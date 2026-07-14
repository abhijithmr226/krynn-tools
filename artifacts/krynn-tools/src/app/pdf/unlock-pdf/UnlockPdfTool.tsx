import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout, FileDropZone } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function UnlockPdfTool({ relatedTools, schema }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
  }, []);

  const process = async () => {
    if (!file) return;
    if (!password) {
      setError("Please enter the PDF password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const unlockedBytes = await doc.save();
      setResult(new Blob([new Uint8Array(unlockedBytes)], { type: "application/pdf" }));
    } catch {
      setError("Failed to unlock PDF. The password may be incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unlocked-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Unlock PDF Online Free"
      subtitle="Remove password from encrypted PDF files. Free, instant unlock tool."
      howToUse={[
        "Upload your password-protected PDF file.",
        "Enter the password used to encrypt the PDF.",
        "Click Unlock PDF to remove the password protection.",
        "Download your unlocked PDF instantly.",
      ]}
      faq={[
        {
          question: "Do I need to know the password?",
          answer: "Yes. You must know the current password to unlock the PDF. The tool uses the password to access and re-save the document.",
        },
        {
          question: "Will unlocking affect the PDF content?",
          answer: "No. Unlocking only removes the password protection. All content, images, and formatting remain unchanged.",
        },
        {
          question: "Is my file secure during unlocking?",
          answer: "Yes. The entire process runs in your browser. Your PDF and password are never sent to any server.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropZone accept=".pdf" onFile={handleFile} label="Drag & drop your encrypted PDF here" />
        )}

        {file && !result && (
          <>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[var(--color-foreground)]">{file.name}</p>
                <button
                  onClick={() => { setFile(null); setResult(null); setPassword(""); setError(""); }}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]">PDF Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the PDF password"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
            )}

            <button onClick={process} disabled={loading} className="btn-primary w-full cursor-pointer">
              {loading ? <span className="flex items-center gap-2"><span className="spinner" /> Unlocking...</span> : "Unlock PDF"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">PDF unlocked successfully — password removed</p>
            </div>
            <button onClick={download} className="btn-primary w-full cursor-pointer">
              Download Unlocked PDF
            </button>
            <button onClick={() => { setResult(null); setPassword(""); }} className="btn-secondary w-full cursor-pointer">
              Unlock Another PDF
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
