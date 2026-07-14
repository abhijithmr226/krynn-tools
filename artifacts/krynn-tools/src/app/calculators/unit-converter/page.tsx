import { getRelatedTools, getTool } from "@/lib/tools";
import UnitConverterTool from "./UnitConverterTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "unit-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function UnitConverterPage() {
  return (
    <UnitConverterTool
      title="Unit Converter Online Free"
      subtitle="Convert units of length, weight, temperature, and more."
      howToUse={[
        "Select a measurement category such as Length, Weight, or Temperature.",
        "Choose the source and target units, then enter a value.",
        "See the conversion result update in real time. Use the swap button to reverse the conversion.",
      ]}
      faq={[
        { question: "What categories are supported?", answer: "This tool supports Length, Weight, Temperature, Volume, Speed, and Data (storage) unit categories with common units in each." },
        { question: "How accurate are the conversions?", answer: "All conversions use standard mathematical conversion factors and are accurate to the precision of JavaScript floating-point numbers." },
        { question: "Is my data sent to a server?", answer: "No. All conversions happen locally in your browser. No data is ever sent to a server." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
