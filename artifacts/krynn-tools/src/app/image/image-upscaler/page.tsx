import { lazy } from "react";
import { getTool, getRelatedTools } from "@/lib/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const ImageUpscalerTool = lazy(() => import("./ImageUpscalerTool"));

const tool = getTool("image", "image-upscaler")!;
const related = getRelatedTools(tool);
const schema = generateToolSchema(tool);

export default function ImageUpscalerPage() {
  return (
    <ToolLayout
      title="Upscale Image Online Free"
      subtitle="Enlarge images up to 4x while enhancing quality using AI-powered interpolation. 100% client-side."
      howToUse={[
        "Upload your image by dragging it into the drop zone or clicking to browse.",
        "Choose the upscale factor (2x or 4x) and output format.",
        "Click the Upscale button to enhance your image.",
        "Download your upscaled image instantly.",
      ]}
      faq={[
        {
          question: "How does image upscaling work?",
          answer: "Our tool uses canvas-based bilinear interpolation to intelligently enlarge images while maintaining sharpness. All processing happens in your browser — no files are uploaded to any server.",
        },
        {
          question: "What is the maximum upscale factor?",
          answer: "You can upscale images up to 4x their original dimensions. For example, a 500x500 image can be enlarged to 2000x2000.",
        },
        {
          question: "What image formats are supported?",
          answer: "You can upload JPG, PNG, and WebP images. The output can be saved as JPG or PNG.",
        },
        {
          question: "Is my image data private?",
          answer: "Absolutely. Your images never leave your device. All upscaling is performed locally in your browser.",
        },
      ]}
      relatedTools={related}
      schema={schema}
    >
      <ImageUpscalerTool />
    </ToolLayout>
  );
}
