import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import PasswordStrengthCheckerTool from "./PasswordStrengthCheckerTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("security", "password-strength-checker")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function PasswordStrengthCheckerPage() {
  return (
    <PasswordStrengthCheckerTool
      title="Password Strength Checker Online Free"
      subtitle="Check how strong your password is. Free online password strength analyzer."
      howToUse={[
        "Type or paste your password into the input field.",
        "Review the real-time strength meter and criteria checklist.",
        "Improve weak criteria to strengthen your password.",
      ]}
      faq={[
        { question: "Is my password sent to a server?", answer: "No. All password analysis is performed entirely in your browser using client-side JavaScript. Your password never leaves your device." },
        { question: "What makes a strong password?", answer: "A strong password is at least 12 characters long and includes uppercase letters, lowercase letters, numbers, and special symbols." },
        { question: "Should I use a password manager?", answer: "Yes. Password managers generate and store strong, unique passwords for every account, so you don't have to remember them." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
