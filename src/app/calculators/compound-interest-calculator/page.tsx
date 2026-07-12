import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import CompoundInterestCalculatorTool from "./CompoundInterestCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "compound-interest-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function CompoundInterestCalculatorPage() {
  return (
    <CompoundInterestCalculatorTool
      title="Compound Interest Calculator Online Free"
      subtitle="Calculate compound interest with detailed breakdown. Free online calculator."
      howToUse={[
        "Enter the principal amount, annual interest rate, and time period in years.",
        "Select the compounding frequency (monthly, quarterly, yearly, etc.).",
        "View the total amount, interest earned, and a year-by-year breakdown.",
      ]}
      faq={[
        { question: "What is compound interest?", answer: "Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods. It causes investments to grow faster than simple interest." },
        { question: "How is compound interest different from simple interest?", answer: "Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal plus any previously earned interest." },
        { question: "What does compounding frequency mean?", answer: "Compounding frequency determines how often interest is calculated and added to the balance. More frequent compounding (e.g., monthly vs yearly) results in higher returns." },
        { question: "How do I calculate compound interest manually?", answer: "The formula is A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
