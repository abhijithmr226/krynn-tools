import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import CurrencyConverterTool from "./CurrencyConverterTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "currency-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function CurrencyConverterPage() {
  return (
    <CurrencyConverterTool
      title="Currency Converter Online Free"
      subtitle="Convert between currencies with live or offline rates. Free online converter."
      howToUse={[
        "Enter the amount you want to convert.",
        "Select the source and target currencies from the dropdowns.",
        "View the converted amount using built-in offline rates.",
      ]}
      faq={[
        { question: "Are the exchange rates live?", answer: "This tool uses built-in offline rates for instant conversion. For live rates, you can configure an API key from exchangerate-api.com in the settings." },
        { question: "Which currencies are supported?", answer: "The tool supports 15+ major world currencies including USD, EUR, GBP, JPY, INR, CAD, AUD, and more." },
        { question: "How often should I check rates?", answer: "Exchange rates fluctuate constantly. For financial decisions, always verify with your bank or a live rate service." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
