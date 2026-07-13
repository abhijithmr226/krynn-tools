import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import QrCodeScannerTool from "./QrCodeScannerTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "qr-code-scanner")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function QrCodeScannerPage() {
  return (
    <QrCodeScannerTool
      title="QR Code Scanner Online Free"
      subtitle="Scan QR codes using your camera or upload an image. Free online scanner."
      howToUse={[
        "Click Start Camera to activate your device camera and point it at a QR code.",
        "Alternatively, upload a QR code image file from your device.",
        "The scanned content will be displayed below with an option to copy or open links.",
      ]}
      faq={[
        { question: "Does this scanner store my camera data?", answer: "No. Camera access is used in real-time only for QR detection. No images or video are stored or transmitted." },
        { question: "What types of QR codes can I scan?", answer: "You can scan QR codes containing URLs, text, email addresses, phone numbers, WiFi credentials, and other standard QR code content types." },
        { question: "Why isn't my QR code scanning?", answer: "Ensure good lighting, hold the camera steady, and make sure the QR code is fully visible in the frame. For uploaded images, ensure the image is clear and well-lit." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
