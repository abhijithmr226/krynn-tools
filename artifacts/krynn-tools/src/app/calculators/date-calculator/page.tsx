import { getRelatedTools, getTool } from "@/lib/tools";
import DateCalculatorTool from "./DateCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "date-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function DateCalculatorPage() {
  return (
    <DateCalculatorTool
      title="Date Calculator Online Free"
      subtitle="Add or subtract days from any date. Free online date calculator."
      howToUse={[
        "Select a starting date using the date picker.",
        "Enter the number of days to add or subtract.",
        "View the resulting date instantly.",
      ]}
      faq={[
        { question: "Can I subtract days from a date?", answer: "Yes, enter a negative number (e.g., -30) to subtract days from the selected date." },
        { question: "Does this account for leap years?", answer: "Yes, the calculator uses JavaScript's Date object which correctly handles leap years and varying month lengths." },
        { question: "What is the maximum range?", answer: "You can add or subtract up to several thousand days. The practical limit depends on the browser's Date object support." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
