import { getRelatedTools, getTool } from "@/lib/tools";
import RandomNumberTool from "./RandomNumberTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "random-number-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function RandomNumberGeneratorPage() {
  return (
    <RandomNumberTool
      title="Random Number Generator Online Free"
      subtitle="Generate random numbers within any range. Free online tool."
      howToUse={[
        "Set the minimum and maximum values to define the range for your random numbers.",
        "Choose how many numbers to generate (1-100) and whether they should all be unique.",
        "Click Generate to create your random numbers, then use Copy All to save them to your clipboard.",
      ]}
      faq={[
        { question: "How random are the generated numbers?", answer: "Our generator uses crypto.getRandomValues() for cryptographically secure randomness. This provides true randomness suitable for lottery draws, gaming, statistical sampling, and more." },
        { question: "Can I generate duplicate numbers?", answer: "By default, duplicates are allowed. Check the Unique Numbers checkbox to ensure all generated numbers are distinct from each other." },
        { question: "What is the maximum range I can use?", answer: "You can set any integer range. The tool supports generating up to 100 numbers per batch with no restrictions on the min/max range values." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
