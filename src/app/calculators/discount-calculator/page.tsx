import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import DiscountCalculatorTool from "./DiscountCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "discount-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function DiscountCalculatorPage() {
  return (
    <DiscountCalculatorTool
      title="Discount Calculator Online Free"
      subtitle="Calculate discount price and savings instantly. Free online discount calculator."
      howToUse={[
        "Enter the original price of the item.",
        "Enter the discount percentage you want to calculate.",
        "See the final price after discount and the total savings amount.",
      ]}
      faq={[
        { question: "How do I calculate a discount?", answer: "Multiply the original price by the discount percentage (divided by 100) to get the savings amount. Subtract the savings from the original price to get the final price." },
        { question: "How do I calculate the discount percentage from a sale price?", answer: "Subtract the sale price from the original price, divide by the original price, then multiply by 100." },
        { question: "Can I calculate multiple discounts?", answer: "This tool calculates a single discount. For sequential discounts, apply the first discount, then use the result as the new price for the second discount." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
