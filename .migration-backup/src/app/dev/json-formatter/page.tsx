import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import JsonFormatterTool from "./JsonFormatterTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("dev", "json-formatter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function JsonFormatterPage() {
  return (
    <JsonFormatterTool
      title="JSON Formatter Online Free"
      subtitle="Format, prettify, and validate JSON data online. Free developer tool."
      howToUse={[
        "Paste your JSON data into the input textarea or type it directly.",
        "Choose your preferred indent size (2 spaces, 4 spaces, or tabs) and click Format.",
        "Copy the formatted output or click Minify to compress it into a single line.",
      ]}
      faq={[
        { question: "What is a JSON formatter?", answer: "A JSON formatter is a tool that takes raw or minified JSON data and adds proper indentation and line breaks to make it readable and structured." },
        { question: "Is my JSON data sent to a server?", answer: "No. All formatting happens locally in your browser. Your JSON data never leaves your device." },
        { question: "What does 'minify JSON' mean?", answer: "Minifying JSON removes all unnecessary whitespace, line breaks, and indentation, producing the smallest possible JSON string." },
        { question: "Does this tool validate JSON?", answer: "Yes. If your JSON has syntax errors, the formatter will display an error message indicating the exact issue so you can fix it." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
