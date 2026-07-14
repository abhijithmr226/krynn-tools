import { getRelatedTools, getTool } from "@/lib/tools";
import AgeCalculatorTool from "./AgeCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "age-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function AgeCalculatorPage() {
  return (
    <AgeCalculatorTool
      title="Age Calculator Online Free"
      subtitle="Calculate your exact age in years, months, and days."
      howToUse={[
        "Select your date of birth using the date picker.",
        "Click Calculate to compute your exact age.",
        "View your age in years, months, and days, plus a countdown to your next birthday.",
      ]}
      faq={[
        { question: "How is my exact age calculated?", answer: "The calculator takes your date of birth and today's date, then computes the difference in years, months, and days by accounting for varying month lengths and leap years." },
        { question: "Does this account for leap years?", answer: "Yes. The calculation properly handles leap years, including whether you were born on February 29th." },
        { question: "How is my next birthday countdown calculated?", answer: "The tool finds the next occurrence of your birth month and day from today and calculates the days remaining until that date." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
