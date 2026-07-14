import { getRelatedTools, getTool } from "@/lib/tools";
import UuidBatchGeneratorTool from "./UuidBatchGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "uuid-batch-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function UuidBatchGeneratorPage() {
  return (
    <UuidBatchGeneratorTool
      title="UUID Batch Generator Online Free"
      subtitle="Generate multiple UUIDs at once. Batch generate up to 1000 UUIDs."
      howToUse={[
        "Enter the number of UUIDs you want to generate (1-1000).",
        "Choose the format: standard with dashes or compact without dashes.",
        "Click Generate, then copy individual UUIDs or copy all at once.",
      ]}
      faq={[
        { question: "What is a UUID?", answer: "UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems. Version 4 UUIDs are randomly generated." },
        { question: "How unique are UUID v4?", answer: "UUID v4 has 122 bits of randomness, making collisions astronomically unlikely. The probability of generating the same UUID twice is approximately 1 in 5.3 Ã— 10^36." },
        { question: "What format options are available?", answer: "Standard format includes dashes (e.g., 550e8400-e29b-41d4-a716-446655440000). Compact format removes dashes for shorter strings." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
