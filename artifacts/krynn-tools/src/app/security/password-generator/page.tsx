import { getRelatedTools, getTool } from "@/lib/tools";
import PasswordGeneratorTool from "./PasswordGeneratorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "password-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function PasswordGeneratorPage() {
  return (
    <PasswordGeneratorTool
      title="Password Generator Online Free"
      subtitle="Generate strong, random passwords online. Customizable length and characters."
      howToUse={[
        "Adjust the password length using the slider (8-64 characters) and select which character types to include.",
        "Click the Generate Password button to create a new random password instantly.",
        "Review the password strength meter and click Copy to save your password to the clipboard.",
      ]}
      faq={[
        { question: "How secure are the generated passwords?", answer: "Our passwords are generated using crypto.getRandomValues(), which provides cryptographically secure randomness — the same method used by browsers and operating systems for security-critical operations." },
        { question: "What password length is recommended?", answer: "For general use, 16-24 characters is recommended. For maximum security, use 32+ characters with all character types enabled. Never use passwords shorter than 12 characters." },
        { question: "Are my passwords stored or transmitted?", answer: "No. All passwords are generated entirely in your browser using client-side JavaScript. Nothing is ever sent to our servers or stored anywhere." },
        { question: "What characters can be included?", answer: "You can include uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (!@#$%^&* etc.). Mixing all types creates the strongest passwords." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
