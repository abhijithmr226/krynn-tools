import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import BarcodeGeneratorTool from "./BarcodeGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "barcode-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function BarcodeGeneratorPage() {
  return (
    <BarcodeGeneratorTool
      title="Barcode Generator Online Free"
      subtitle="Generate barcodes from text or numbers. Supports multiple barcode formats."
      howToUse={[
        "Enter the text or number to encode in the barcode.",
        "Select a barcode format (CODE128, EAN13, etc.) from the dropdown.",
        "Click Generate to create the barcode, then download as SVG or copy the image.",
      ]}
      faq={[
        { question: "What barcode format should I use?", answer: "CODE128 is the most versatile format for general use. EAN13 is used for retail products. CODE39 is common in industrial settings. Choose based on your requirements." },
        { question: "Can I download the barcode?", answer: "Yes, you can download the generated barcode as an SVG file, which is vector-based and scalable to any size without losing quality." },
        { question: "What data can I encode?", answer: "Most formats support numbers and uppercase letters. CODE128 supports the full ASCII character set. EAN13 and UPC require specific numeric formats." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
