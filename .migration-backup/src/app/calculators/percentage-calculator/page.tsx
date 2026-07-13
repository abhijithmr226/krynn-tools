import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import PercentageCalculatorTool from "./PercentageCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "percentage-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function PercentageCalculatorPage() {
  return (
    <PercentageCalculatorTool
      title="Percentage Calculator Online Free"
      subtitle="Calculate percentages, percentage change, and more."
      howToUse={[
        "Select the calculation mode: X is what % of Y, What is X% of Y, or Percentage change.",
        "Enter the required values in the input fields.",
        "Click Calculate to see the result instantly.",
      ]}
      faq={[
        { question: "What is a percentage?", answer: "A percentage is a number expressed as a fraction of 100. For example, 25% means 25 out of every 100, or 0.25 as a decimal." },
        { question: "How do I calculate percentage change?", answer: "Percentage change = ((New Value - Old Value) / Old Value) Ã— 100. A positive result means an increase, negative means a decrease." },
        { question: "Can I use negative numbers?", answer: "Yes. You can use negative numbers for all modes. For percentage change, this is useful for calculating losses or decreases." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
