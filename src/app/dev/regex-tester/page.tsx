import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import RegexTesterTool from "./RegexTesterTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("dev", "regex-tester")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function RegexTesterPage() {
  return (
    <RegexTesterTool
      title="Regex Tester Online Free"
      subtitle="Test regular expressions online with real-time matching."
      howToUse={[
        "Enter your regular expression pattern in the pattern field.",
        "Toggle the flags (g, i, m, s) as needed for your use case.",
        "Type or paste your test string and see matches highlighted in real time.",
      ]}
      faq={[
        { question: "What regex syntax is supported?", answer: "This tool supports standard JavaScript regex syntax including character classes, quantifiers, groups, lookaheads, and more." },
        { question: "What do the flags mean?", answer: "g = global (find all matches), i = case-insensitive, m = multiline (^ and $ match line boundaries), s = dotAll (. matches newlines)." },
        { question: "Is my data sent to a server?", answer: "No. All regex testing happens locally in your browser. Your patterns and test strings never leave your device." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
