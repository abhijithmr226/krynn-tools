import { getRelatedTools, getTool } from "@/lib/tools";
import FuelCostCalculatorTool from "./FuelCostCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "fuel-cost-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function FuelCostCalculatorPage() {
  return (
    <FuelCostCalculatorTool
      title="Fuel Cost Calculator Online Free"
      subtitle="Calculate total fuel cost for your trip based on distance and fuel efficiency."
      howToUse={[
        "Enter the total distance of your trip.",
        "Enter your vehicle's fuel efficiency (km/L or mpg).",
        "Enter the current fuel price per unit and view the total cost.",
      ]}
      faq={[
        { question: "How is fuel cost calculated?", answer: "Fuel cost = (Distance / Fuel Efficiency) Ã— Fuel Price. For example, 500 km at 15 km/L with $1.5/L fuel = 33.33 L Ã— $1.5 = $50." },
        { question: "What is a good fuel efficiency?", answer: "Fuel efficiency varies by vehicle. Modern cars average 12-20 km/L (28-47 mpg). Hybrids can achieve 20-30 km/L (47-70 mpg)." },
        { question: "Should I use km/L or mpg?", answer: "Use whichever unit your vehicle's specifications use. Most countries use km/L, while the US and UK commonly use mpg." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
