import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import RemoveBackgroundTool from "./RemoveBackgroundTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("image", "remove-background")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function RemoveBackgroundPage() {
  return (
    <RemoveBackgroundTool
      title="Remove Background from Image Free"
      subtitle="Remove image background instantly. 100% client-side processing."
      howToUse={[
        "Upload your image by dragging it into the drop zone or clicking to browse.",
        "Adjust the threshold and tolerance sliders to fine-tune background detection.",
        "Preview the result and click Download to save the processed image with transparent background.",
      ]}
      faq={[
        { question: "How does background removal work?", answer: "This tool uses a threshold-based algorithm to detect and remove background pixels. It samples the corners of the image to determine the likely background color and removes similar pixels based on the tolerance setting." },
        { question: "What image formats are supported?", answer: "The tool accepts JPG, PNG, WebP, and BMP images. The output is saved as PNG to preserve the transparent background." },
        { question: "Is my image uploaded to a server?", answer: "No. All processing happens entirely in your browser using the Canvas API. Your images never leave your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
