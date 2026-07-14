import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const OcrImageToTextTool = lazy(() => import("./OcrImageToTextTool"));

const tool = getTool("image", "ocr-image-to-text")!;
const related = getRelatedTools(tool);
const schema = generateToolSchema(tool);

export default function OcrImageToTextPage() {
  return (
    <ToolLayout
      title="OCR Image to Text Online Free"
      subtitle="Extract text from images using OCR technology. Supports JPG, PNG, WebP, and BMP formats. 100% client-side."
      howToUse={[
        "Upload your image by dragging it into the drop zone or clicking to browse.",
        "Select the document language for accurate text recognition.",
        "Click the Extract Text button and wait for OCR processing.",
        "Copy the extracted text to your clipboard or download it as a .txt file.",
      ]}
      faq={[
        {
          question: "What is OCR?",
          answer: "OCR (Optical Character Recognition) technology recognizes text in images and converts it into editable, searchable text. Our tool runs entirely in your browser using Tesseract.js.",
        },
        {
          question: "What image formats are supported?",
          answer: "We support JPG, PNG, WebP, and BMP image formats. For best results, use high-contrast images with clear text.",
        },
        {
          question: "Which languages are supported?",
          answer: "Tesseract.js supports over 100 languages. We provide quick selection for 20+ common languages including English, Spanish, French, German, Chinese, Japanese, Korean, and more.",
        },
        {
          question: "Is my image data private?",
          answer: "Yes. All OCR processing happens locally in your browser. Your images are never uploaded to any server.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <OcrImageToTextTool />
    </ToolLayout>
  );
}
