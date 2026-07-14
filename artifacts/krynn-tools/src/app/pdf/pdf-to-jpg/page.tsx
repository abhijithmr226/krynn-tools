import { getRelatedTools, getTool } from "@/lib/tools";
import PdfToJpgTool from "./PdfToJpgTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("pdf", "pdf-to-jpg")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function PdfToJpgPage() {
  return (
    <PdfToJpgTool
      title="PDF to JPG Converter Free"
      subtitle="Convert PDF pages to JPG images online. High quality, free conversion."
      howToUse={[
        "Upload your PDF file by dragging it into the drop zone or clicking to browse.",
        "Each page will be rendered and displayed as a JPG image preview.",
        "Click Download All to save all pages as JPG files, or download individual pages.",
      ]}
      faq={[
        { question: "Is there a limit to how many pages I can convert?", answer: "There is no hard page limit, but very large PDFs (100+ pages) may take longer to render. Each page is converted individually in your browser." },
        { question: "What quality are the JPG images?", answer: "The JPG images are rendered at the original PDF resolution (typically 72–150 DPI). For higher quality, the tool renders at 2x scale by default." },
        { question: "Is my PDF data private?", answer: "Absolutely. All conversion happens locally in your browser. Your PDF files are never uploaded to any server." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
