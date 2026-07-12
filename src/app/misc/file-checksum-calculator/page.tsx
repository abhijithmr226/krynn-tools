import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import FileChecksumCalculatorTool from "./FileChecksumCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "file-checksum-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function FileChecksumCalculatorPage() {
  return (
    <FileChecksumCalculatorTool
      title="File Checksum Calculator Online Free"
      subtitle="Calculate MD5, SHA-256, and SHA-512 checksums for any file. Client-side."
      howToUse={[
        "Drop a file onto the upload area or click to browse and select a file.",
        "Wait for the checksums to be calculated (processing happens entirely in your browser).",
        "Copy any of the generated hashes (MD5, SHA-256, SHA-512) to your clipboard.",
      ]}
      faq={[
        { question: "What is a file checksum?", answer: "A checksum is a unique digital fingerprint of a file. If even one bit changes, the checksum changes. It's used to verify file integrity and detect corruption." },
        { question: "Are my files uploaded to a server?", answer: "No. All checksum calculations use the Web Crypto API and run entirely in your browser. Files never leave your device." },
        { question: "Which hash should I use?", answer: "SHA-256 is the recommended standard for most use cases. MD5 is faster but less secure. SHA-512 provides the strongest guarantees." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
