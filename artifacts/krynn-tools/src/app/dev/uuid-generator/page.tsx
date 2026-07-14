import { getRelatedTools, getTool } from "@/lib/tools";
import UuidGeneratorTool from "./UuidGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("dev", "uuid-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function UuidGeneratorPage() {
  return (
    <UuidGeneratorTool
      title="UUID Generator Online Free"
      subtitle="Generate random UUIDs v4 online. Batch generate up to 1000 UUIDs."
      howToUse={[
        "Enter the number of UUIDs you want to generate (1–100).",
        "Select the UUID version (v4 is the standard random UUID).",
        "Click Generate, then copy individual UUIDs or use Copy All to grab them at once.",
      ]}
      faq={[
        { question: "What is a UUID v4?", answer: "A UUID v4 is a universally unique identifier generated using random numbers. Each UUID is 128 bits long and formatted as 8-4-4-4-12 hex characters." },
        { question: "How unique are generated UUIDs?", answer: "UUID v4 uses 122 random bits, making collisions astronomically unlikely. The probability of generating two identical UUIDs is approximately 1 in 5.3 Ã— 10Â³â¶." },
        { question: "Are generated UUIDs cryptographically secure?", answer: "Yes. This tool uses the browser's crypto.randomUUID() API which provides cryptographically strong random values." },
        { question: "Can I use these UUIDs in production?", answer: "Absolutely. UUIDs generated here are valid RFC 4122 v4 UUIDs suitable for database primary keys, API identifiers, and any application needing unique IDs." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
