import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import CssGradientTool from "./CssGradientTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("design", "css-gradient-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function CssGradientGeneratorPage() {
  return (
    <CssGradientTool
      title="CSS Gradient Generator Free"
      subtitle="Create beautiful CSS gradients with live preview. Copy-ready code output."
      howToUse={[
        "Select your gradient type: linear or radial from the dropdown.",
        "Pick your start and end colors using the color pickers.",
        "Adjust the angle slider (linear only) to fine-tune the gradient direction.",
        "Preview the gradient live and click Copy CSS to use it in your project.",
      ]}
      faq={[
        { question: "What is a CSS gradient?", answer: "A CSS gradient is a background image created using CSS that transitions between two or more colors. It can be linear (along a line), radial (from a center point), or conic." },
        { question: "Can I add more than two colors?", answer: "This generator supports two-color gradients. For multi-stop gradients, use the generated CSS as a starting point and add additional color stops manually." },
        { question: "Are the generated gradients compatible with all browsers?", answer: "Yes. The generated CSS includes both the standard syntax and the -webkit- prefixed version for maximum browser compatibility." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
