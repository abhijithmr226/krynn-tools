import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import RandomTokenGeneratorTool from "./RandomTokenGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "random-token-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function RandomTokenGeneratorPage() {
  return (
    <RandomTokenGeneratorTool
      title="Random Token Generator Online Free"
      subtitle="Generate secure random tokens in alphanumeric, hex, or base64 format."
      howToUse={[
        "Select the desired token length using the slider.",
        "Choose a character set: alphanumeric, hexadecimal, or base64.",
        "Click Generate and copy the token to your clipboard.",
      ]}
      faq={[
        { question: "How are these tokens generated?", answer: "Tokens are generated using crypto.getRandomValues(), a cryptographically secure random number generator built into modern browsers." },
        { question: "Which character set should I choose?", answer: "Alphanumeric (A-Z, a-z, 0-9) is most readable. Hex (0-9, a-f) is best for encoded data. Base64 offers the most entropy per character." },
        { question: "What length should I use?", answer: "For API keys and session tokens, 32-64 characters is recommended. For simple identifiers, 16-24 characters is usually sufficient." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
