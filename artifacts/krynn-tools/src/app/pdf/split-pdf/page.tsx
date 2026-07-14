import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const SplitPdfTool = lazy(() => import("./SplitPdfTool"));

const tool = getTool("pdf", "split-pdf")!;
const related = getRelatedTools(tool);


const schema = generateToolSchema(tool);

export default function SplitPdfPage() {
  return (
    <ToolLayout
      title="Split PDF Online Free"
      subtitle="Split a PDF into multiple files. Extract specific pages from PDF documents."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone or clicking to browse.",
        "Enter the page ranges you want to extract (e.g., 1-3, 5, 7-10).",
        "Click the Split PDF button to extract the selected pages.",
        "Download your split PDF files instantly.",
      ]}
      faq={[
        {
          question: "How do I specify page ranges?",
          answer: "You can enter page ranges using commas to separate them. For example, '1-3, 5, 7-10' will extract pages 1 through 3, page 5, and pages 7 through 10.",
        },
        {
          question: "Can I split a PDF into individual pages?",
          answer: "Yes. You can enter '1-20' (for a 20-page PDF) to extract all pages, or use the 'Split into single pages' option to download each page as a separate file.",
        },
        {
          question: "Will the extracted pages lose quality?",
          answer: "No. Splitting a PDF simply extracts the selected pages into new files. There is no re-encoding or quality loss during the process.",
        },
        {
          question: "Is my PDF safe when splitting?",
          answer: "Absolutely. All splitting is performed locally in your browser using pdf-lib. Your files never leave your device.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <SplitPdfTool />
    </ToolLayout>
  );
}
