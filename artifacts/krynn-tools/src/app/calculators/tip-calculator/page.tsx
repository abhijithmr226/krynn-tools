import { getRelatedTools, getTool } from "@/lib/tools";
import TipCalculatorTool from "./TipCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "tip-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function TipCalculatorPage() {
  return (
    <TipCalculatorTool
      title="Tip Calculator Online Free"
      subtitle="Calculate tip amount and total bill split. Free online tip calculator."
      howToUse={[
        "Enter the total bill amount.",
        "Set the tip percentage using the slider or preset buttons.",
        "Enter the number of people splitting the bill to see per-person totals.",
      ]}
      faq={[
        { question: "What is a standard tip percentage?", answer: "In the US, 15-20% is standard for restaurant service. For excellent service, 20-25% is common. In other countries, tipping norms vary significantly." },
        { question: "Should I tip before or after tax?", answer: "It's customary to calculate tip on the pre-tax bill amount, though many people tip on the total including tax." },
        { question: "How do I split the bill evenly?", answer: "Enter the number of people splitting the bill, and the calculator will show the tip per person and total per person." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
