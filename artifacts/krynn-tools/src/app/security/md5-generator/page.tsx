import { getRelatedTools, getTool } from "@/lib/tools";
import Md5GeneratorTool from "./Md5GeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "md5-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function Md5GeneratorPage() {
  return (
    <Md5GeneratorTool
      title="MD5 Generator Online Free"
      subtitle="Generate MD5 hash from any text string online. Free hash generator."
      howToUse={[
        "Enter or paste the text you want to hash into the input field.",
        "Click Generate to compute the MD5 hash instantly.",
        "Copy the result to your clipboard with one click.",
      ]}
      faq={[
        { question: "What is MD5?", answer: "MD5 (Message-Digest Algorithm 5) is a cryptographic hash function that produces a 128-bit (32-character hexadecimal) hash value. It's commonly used for file checksums." },
        { question: "Is MD5 secure?", answer: "MD5 is no longer considered cryptographically secure for password hashing or digital signatures. However, it's still useful for file checksums and non-security-critical applications." },
        { question: "Is my input stored anywhere?", answer: "No. All hashing is performed client-side in your browser. Your input is never transmitted to any server." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
