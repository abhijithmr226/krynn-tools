import { Metadata } from "next";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import CompressPdfTool from "./CompressPdfTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "compress-pdf")!;
const related = getRelatedTools(tool);

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function CompressPdfPage() {
  return (
    <ToolLayout
      title="Compress PDF Online Free"
      subtitle="Reduce PDF file size without losing quality. 100% client-side processing."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone or clicking to browse.",
        "Choose your desired compression quality level.",
        "Click the Compress button to reduce the file size.",
        "Download your compressed PDF file instantly.",
      ]}
      faq={[
        {
          question: "How does PDF compression work?",
          answer: "Our tool uses pdf-lib to compress PDF files by reducing image quality and optimizing the document structure. All processing happens in your browser — no files are uploaded to any server.",
        },
        {
          question: "Will compression reduce the quality of my PDF?",
          answer: "You can choose between different compression levels. Low compression maintains near-original quality with modest size reduction, while high compression significantly reduces file size with some quality loss.",
        },
        {
          question: "Is there a file size limit?",
          answer: "Since all processing happens in your browser, the limit depends on your device's memory. We recommend files under 50MB for the best experience.",
        },
        {
          question: "Is my PDF data private and secure?",
          answer: "Absolutely. Your files never leave your device. All compression is performed locally in your browser using client-side JavaScript. We have no access to your documents.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <CompressPdfTool />
    </ToolLayout>
  );
}
