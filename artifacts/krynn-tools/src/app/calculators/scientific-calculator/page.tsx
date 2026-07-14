import { getRelatedTools, getTool } from "@/lib/tools";
import ScientificCalculatorTool from "./ScientificCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "scientific-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function ScientificCalculatorPage() {
  return (
    <ScientificCalculatorTool
      title="Scientific Calculator Online Free"
      subtitle="Full scientific calculator with sin, cos, tan, log, sqrt, and more online."
      howToUse={[
        "Click the number and operator buttons to build your expression.",
        "Use scientific functions like sin, cos, tan, log, and sqrt from the function row.",
        "Press = to evaluate and see the result. Use C to clear.",
      ]}
      faq={[
        { question: "What functions does this calculator support?", answer: "It supports basic arithmetic, trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, power, factorial, and constants (pi, e)." },
        { question: "Is this calculator in degrees or radians?", answer: "Trigonometric functions use degrees by default." },
        { question: "How do I calculate square roots?", answer: "Press the sqrt button, then enter the number and press =." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
