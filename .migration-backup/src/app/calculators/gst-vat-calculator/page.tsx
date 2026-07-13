import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import GstVatCalculatorTool from "./GstVatCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "gst-vat-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function GstVatCalculatorPage() {
  return (
    <GstVatCalculatorTool
      title="GST/VAT Calculator Online Free"
      subtitle="Calculate GST or VAT on any amount. Add or reverse tax instantly online."
      howToUse={[
        "Enter the amount and select the GST/VAT rate from the dropdown.",
        "Choose whether to add tax to the amount or reverse-calculate the base price.",
        "View the tax amount and total (or base price) instantly.",
      ]}
      faq={[
        { question: "What is GST?", answer: "GST (Goods and Services Tax) is a value-added tax applied to the supply of goods and services. It varies by country and product category." },
        { question: "What is VAT?", answer: "VAT (Value Added Tax) is similar to GST and is charged at each stage of production or sale. Common rates range from 5% to 25% depending on the country." },
        { question: "How do I reverse-calculate GST/VAT?", answer: "To find the base price from a tax-inclusive amount, divide the total by (1 + tax rate). For example, $118 at 18% GST = $118 / 1.18 = $100." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
