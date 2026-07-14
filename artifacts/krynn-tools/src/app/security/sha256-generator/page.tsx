import { getRelatedTools, getTool } from "@/lib/tools";
import Sha256GeneratorTool from "./Sha256GeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "sha256-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function Sha256GeneratorPage() {
  return (
    <Sha256GeneratorTool
      title="SHA256 Generator Online Free"
      subtitle="Generate SHA-256 hash online. Free secure hash calculator."
      howToUse={[
        "Enter or paste the text you want to hash into the input field.",
        "Click Generate to compute the SHA-256 hash instantly.",
        "Copy the 64-character hex result to your clipboard.",
      ]}
      faq={[
        { question: "What is SHA-256?", answer: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 256-bit (64-character hexadecimal) hash value. It's widely used in blockchain, TLS certificates, and data integrity verification." },
        { question: "Is SHA-256 secure?", answer: "SHA-256 is currently considered cryptographically secure. It's part of the SHA-2 family and is used by the Bitcoin protocol and many security standards." },
        { question: "How is SHA-256 different from MD5?", answer: "SHA-256 produces a 256-bit hash (64 hex characters) while MD5 produces a 128-bit hash (32 hex characters). SHA-256 is significantly more secure against collision attacks." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
