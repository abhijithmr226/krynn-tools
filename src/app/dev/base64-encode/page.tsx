import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import Base64Tool from "./Base64Tool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("dev", "base64-encode")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function Base64EncodePage() {
  return (
    <Base64Tool
      title="Base64 Encoder & Decoder Free"
      subtitle="Encode and decode Base64 strings online. Free developer tool."
      howToUse={[
        "Paste or type your text into the input field.",
        "Click Encode to convert text to Base64, or Decode to convert Base64 back to text.",
        "Click the Copy button to copy the result to your clipboard.",
      ]}
      faq={[
        { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data as an ASCII string. It is commonly used to encode data for transmission over systems that handle text." },
        { question: "Does this support Unicode/UTF-8?", answer: "Yes. This tool properly handles Unicode and UTF-8 characters by encoding them to UTF-8 bytes before Base64 encoding." },
        { question: "Can I encode binary data like images?", answer: "This tool is designed for text encoding/decoding. For binary data, use the dedicated image or file conversion tools." },
        { question: "Is my data sent to a server?", answer: "No. All encoding and decoding happens locally in your browser using native btoa/atob functions. Your data never leaves your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
