import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const FileConverterTool = lazy(() => import("./FileConverterTool"));

const tool = getTool("misc", "file-converter")!;
const related = getRelatedTools(tool);
const schema = generateToolSchema(tool);

export default function FileConverterPage() {
  return (
    <ToolLayout
      title="Free Online File Converter"
      subtitle="Convert files between formats instantly. Supports images, text, and more. 100% client-side, no upload needed."
      howToUse={[
        "Upload your file by dragging it into the drop zone or clicking to browse.",
        "Select the output format you want to convert to.",
        "Click the Convert button to start the conversion.",
        "Download your converted file instantly.",
      ]}
      faq={[
        {
          question: "What file formats are supported?",
          answer: "We support image formats (JPG, PNG, WebP, BMP, GIF), text formats (TXT, CSV, JSON, XML), and document formats (PDF). More formats are added regularly.",
        },
        {
          question: "Is there a file size limit?",
          answer: "Since processing happens in your browser, the limit depends on your device's memory. We recommend files under 50MB for the best experience.",
        },
        {
          question: "Is my file uploaded to a server?",
          answer: "No. All conversion happens locally in your browser. Your files never leave your device, ensuring complete privacy.",
        },
        {
          question: "Can I convert multiple files at once?",
          answer: "Currently, our converter handles one file at a time for the best quality. You can process multiple files by converting them one after another.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <FileConverterTool />
    </ToolLayout>
  );
}
