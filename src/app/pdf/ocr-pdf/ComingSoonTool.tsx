"use client";

import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  toolName: string;
  description: string;
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function ComingSoonTool({ toolName, description, relatedTools, schema }: Props) {
  return (
    <ToolLayout
      title={`${toolName} — Coming Soon`}
      subtitle={description}
      howToUse={[
        "This tool is currently under development.",
        "OCR requires rendering PDF pages to images and running text recognition.",
        "We are integrating tesseract.js for client-side OCR processing.",
        "Stay tuned — it will be available soon!",
      ]}
      faq={[
        {
          question: "What is OCR?",
          answer: "OCR (Optical Character Recognition) is technology that recognizes text in images and scanned documents, converting them into searchable, editable text.",
        },
        {
          question: "Why is this tool not available yet?",
          answer: "OCR processing is computationally intensive. We are optimizing tesseract.js integration to ensure fast, client-side processing without server uploads.",
        },
        {
          question: "Will OCR work with any language?",
          answer: "Tesseract.js supports over 100 languages. When released, you will be able to select the document language for accurate text recognition.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-muted)]">
          <svg className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-[var(--color-foreground)]">Coming Soon</h3>
        <p className="text-[var(--color-muted-foreground)] max-w-md mx-auto">
          {description} We are integrating tesseract.js for fully client-side OCR processing. Your scanned documents will never leave your device.
        </p>
      </div>
    </ToolLayout>
  );
}
