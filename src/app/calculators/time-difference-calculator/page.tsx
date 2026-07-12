import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import TimeDifferenceCalculatorTool from "./TimeDifferenceCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "time-difference-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function TimeDifferenceCalculatorPage() {
  return (
    <TimeDifferenceCalculatorTool
      title="Time Difference Calculator Online Free"
      subtitle="Calculate the exact difference between two dates and times online."
      howToUse={[
        "Select the start date and time using the date/time pickers.",
        "Select the end date and time.",
        "View the difference in years, months, days, hours, and minutes.",
      ]}
      faq={[
        { question: "How is the time difference calculated?", answer: "The tool calculates the precise difference between two date/time values, accounting for varying month lengths and leap years." },
        { question: "Can I calculate time between two times on the same day?", answer: "Yes, set both date pickers to the same date and only change the times to get the time duration within a single day." },
        { question: "Does this account for daylight saving time?", answer: "The calculation uses the browser's local timezone. Differences may vary if the two dates fall on different sides of a DST transition." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
