import { getRelatedTools, getTool } from "@/lib/tools";
import HashGeneratorTool from "./HashGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("dev", "hash-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function HashGeneratorPage() {
  return (
    <HashGeneratorTool
      title="Hash Generator Online Free"
      subtitle="Generate MD5, SHA1, SHA256, SHA512 hashes online. Free hash calculator."
      howToUse={[
        "Enter or paste any text into the input area — this is the data you want to hash.",
        "All four hash types (MD5, SHA1, SHA256, SHA512) are generated automatically as you type.",
        "Click the copy button next to any hash to copy it to your clipboard for use elsewhere.",
      ]}
      faq={[
        { question: "What is a hash function?", answer: "A hash function converts input data of any size into a fixed-length string. The output is deterministic — the same input always produces the same hash, but it's computationally infeasible to reverse the process." },
        { question: "Which hash type should I use?", answer: "For security-sensitive applications, use SHA256 or SHA512. MD5 and SHA1 are faster but are considered cryptographically broken for security purposes. MD5 is still useful for checksums and non-security use cases." },
        { question: "Are the hashes generated client-side?", answer: "Yes. All hash calculations happen entirely in your browser using the crypto-js library. Your input data never leaves your device." },
        { question: "What is the difference between MD5, SHA1, SHA256, and SHA512?", answer: "They differ in output length and security level: MD5 (128-bit), SHA1 (160-bit), SHA256 (256-bit), and SHA512 (512-bit). Longer hashes are generally more secure against collision attacks." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
