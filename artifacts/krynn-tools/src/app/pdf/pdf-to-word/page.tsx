import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const PdfToWordTool = lazy(() => import("./PdfToWordTool"));

const tool = getTool("pdf", "pdf-to-word")!;
const related = getRelatedTools(tool);


const schema = generateToolSchema(tool);

export default function PdfToWordPage() {
  return (
    <ToolLayout
      title="PDF to Word Converter Free"
      subtitle="Convert PDF to editable text documents online. Client-side processing."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone or clicking to browse.",
        "Preview the extracted text from your PDF.",
        "Click the Download Text button to save the extracted content.",
        "Open the downloaded .txt file in any text editor or word processor.",
      ]}
      faq={[
        {
          question: "Does this produce a .docx file?",
          answer: "Currently this tool extracts plain text from PDF files and saves it as a .txt file. For full DOCX conversion with formatting preserved, server-side processing would be required.",
        },
        {
          question: "Will the text formatting be preserved?",
          answer: "This tool extracts the raw text content from PDF files. Basic formatting like paragraphs and line breaks are preserved, but complex formatting like fonts, colors, and layouts may not transfer perfectly.",
        },
        {
          question: "Can it extract text from scanned PDFs?",
          answer: "No. This tool works with PDFs that contain selectable text. Scanned PDFs are essentially images and require OCR (Optical Character Recognition) which is not yet available in this client-side tool.",
        },
        {
          question: "Is my PDF data private?",
          answer: "Absolutely. All text extraction happens locally in your browser. Your PDF files are never uploaded to any server.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <PdfToWordTool />
    </ToolLayout>
  );
}
