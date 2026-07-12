import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getRelatedTools, getTool } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const QrCodeGeneratorTool = dynamic(() => import("./QrCodeGeneratorTool"));


const tool = getTool("security", "qr-code-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function QrCodeGeneratorPage() {
  return (
    <QrCodeGeneratorTool
      title="QR Code Generator Online Free"
      subtitle="Generate QR codes from text, URLs, or contact info. Free QR code maker."
      howToUse={[
        "Enter the text, URL, or contact information you want to encode in the input field.",
        "Choose the QR code size and customize the foreground and background colors to match your needs.",
        "Click Generate to create your QR code, then download it as a PNG image.",
      ]}
      faq={[
        { question: "What can I encode in a QR code?", answer: "You can encode any text, URLs, email addresses, phone numbers, WiFi credentials, or plain contact information. The QR code simply converts your text into a scannable pattern." },
        { question: "Is the QR code generation free?", answer: "Yes, our QR code generator is 100% free with no limits. You can create unlimited QR codes without signing up." },
        { question: "How do I download the QR code?", answer: "After generating your QR code, click the Download PNG button to save the image to your device. The QR code is rendered on a canvas element for crisp, high-quality output." },
        { question: "Will the QR code work on all scanners?", answer: "Yes. Our QR codes follow the standard QR code specification and are compatible with all QR code reader apps, including built-in camera apps on iOS and Android." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
