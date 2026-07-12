"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #2563eb; margin-bottom: 16px; }
    p { font-size: 16px; line-height: 1.6; margin-bottom: 12px; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a sample HTML document. Edit the code on the left to create your own content.</p>
  <p>You can use <span class="highlight">any HTML and CSS</span> to style your document.</p>
  <p>Click <strong>"Convert to PDF"</strong> when you're ready to download.</p>
</body>
</html>`;

export default function HtmlToPdfTool({ relatedTools, schema }: Props) {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [error, setError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleConvert = useCallback(() => {
    setError("");
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      setError("Preview is not ready. Please wait a moment and try again.");
      return;
    }
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch {
      setError("Failed to open print dialog. Please try again.");
    }
  }, []);

  return (
    <ToolLayout
      title="HTML to PDF Converter Online Free"
      subtitle="Convert HTML code into a downloadable PDF document instantly."
      howToUse={[
        "Write or paste your HTML code in the editor on the left.",
        "See a live preview of your document on the right.",
        "Click Convert to PDF to open the print dialog.",
        "Choose 'Save as PDF' as the destination and click Save.",
      ]}
      faq={[
        {
          question: "How do I save the output as PDF?",
          answer: "After clicking Convert to PDF, the browser's print dialog will open. Select 'Save as PDF' as the destination/printer and click Save.",
        },
        {
          question: "Does this support CSS styling?",
          answer: "Yes. You can use any HTML and CSS in your code, including inline styles, external stylesheets (via <style> tags), and modern CSS features.",
        },
        {
          question: "Is my data uploaded to a server?",
          answer: "No. The HTML is rendered directly in your browser using a sandboxed iframe. No data is sent to any server.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="border-b border-[var(--color-border)] px-4 py-2">
              <label className="text-sm font-semibold text-[var(--color-foreground)]">HTML Code</label>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="h-[400px] w-full resize-none bg-[var(--color-background)] p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none lg:h-[500px]"
              placeholder="Enter your HTML code here..."
              spellCheck={false}
            />
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="border-b border-[var(--color-border)] px-4 py-2">
              <label className="text-sm font-semibold text-[var(--color-foreground)]">Live Preview</label>
            </div>
            <div className="h-[400px] overflow-auto bg-white lg:h-[500px]">
              <iframe
                ref={iframeRef}
                srcDoc={html}
                title="PDF Preview"
                className="h-full w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-[var(--color-destructive)]">{error}</p>
        )}

        <button onClick={handleConvert} className="btn-primary w-full cursor-pointer">
          Convert to PDF
        </button>
      </div>
    </ToolLayout>
  );
}
