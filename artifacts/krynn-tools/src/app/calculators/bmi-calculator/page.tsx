import { getRelatedTools, getTool } from "@/lib/tools";
import BmiCalculatorTool from "./BmiCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "bmi-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function BmiCalculatorPage() {
  return (
    <BmiCalculatorTool
      title="BMI Calculator Online Free"
      subtitle="Calculate your Body Mass Index instantly. Free online BMI calculator."
      howToUse={[
        "Enter your weight in kg (or switch to lbs) and your height in cm (or switch to ft/in).",
        "Click Calculate to compute your BMI value instantly.",
        "Review your BMI category and health indicator shown below the result.",
      ]}
      faq={[
        { question: "What is BMI?", answer: "BMI (Body Mass Index) is a numerical value calculated from your weight and height. It is a screening tool used to categorize individuals into weight categories." },
        { question: "What are the BMI categories?", answer: "BMI below 18.5 is Underweight, 18.5–24.9 is Normal weight, 25–29.9 is Overweight, and 30 or above is Obese." },
        { question: "Is BMI accurate for everyone?", answer: "BMI is a general screening tool and does not account for muscle mass, bone density, or body composition. Athletes and muscular individuals may have a high BMI without being overweight." },
        { question: "What is a healthy BMI range?", answer: "A healthy BMI is typically between 18.5 and 24.9. However, individual health depends on many factors beyond BMI alone." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
