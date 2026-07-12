import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const JpgToPdfTool = dynamic(() => import("./JpgToPdfTool"));

const tool = getTool("pdf", "jpg-to-pdf")!;
const related = getRelatedTools(tool);

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function JpgToPdfPage() {
  return (
    <ToolLayout
      title="JPG to PDF Converter Free"
      subtitle="Convert JPG images to PDF documents online. Batch conversion supported."
      howToUse={[
        "Upload one or more JPG images by dragging them into the drop zone.",
        "Choose your preferred page size (A4, Letter, or Fit to Image).",
        "Click the Convert to PDF button to create your document.",
        "Download the generated PDF file instantly.",
      ]}
      faq={[
        {
          question: "What image formats are supported?",
          answer: "This tool supports JPG/JPEG, PNG, and WebP image formats. All images are converted to PDF pages.",
        },
        {
          question: "How many images can I convert at once?",
          answer: "You can upload as many images as your browser's memory allows. Each image will become one page in the resulting PDF.",
        },
        {
          question: "Can I choose the page size?",
          answer: "Yes. You can select from A4, US Letter, or Fit to Image (where each page matches the image dimensions).",
        },
        {
          question: "Are my images kept private?",
          answer: "Absolutely. All conversion happens locally in your browser. Your images are never uploaded to any server.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <JpgToPdfTool />
    </ToolLayout>
  );
}
