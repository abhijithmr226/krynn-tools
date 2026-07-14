import { getRelatedTools, getTool } from "@/lib/tools";
import TimeZoneConverterTool from "./TimeZoneConverterTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("misc", "time-zone-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function TimeZoneConverterPage() {
  return (
    <TimeZoneConverterTool
      title="Time Zone Converter Online Free"
      subtitle="Convert time between any two timezones instantly. Free online converter."
      howToUse={[
        "Select the source timezone and enter the date and time.",
        "Select the target timezone you want to convert to.",
        "View the converted time and the offset difference instantly.",
      ]}
      faq={[
        { question: "Which timezones are supported?", answer: "The tool supports all IANA timezones via the Intl API, including major cities worldwide such as New York, London, Tokyo, Sydney, Dubai, and many more." },
        { question: "Does this account for daylight saving time?", answer: "Yes. The Intl API automatically handles DST transitions for each timezone based on the date provided." },
        { question: "What is UTC offset?", answer: "UTC offset is the difference in hours and minutes between a timezone and Coordinated Universal Time (UTC). For example, EST is UTC-5 and JST is UTC+9." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
