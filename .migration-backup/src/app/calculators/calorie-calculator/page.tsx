import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import CalorieCalculatorTool from "./CalorieCalculatorTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";


const tool = getTool("calculators", "calorie-calculator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);

export default function CalorieCalculatorPage() {
  return (
    <CalorieCalculatorTool
      title="Calorie Calculator Online Free"
      subtitle="Calculate your BMR and TDEE based on age, weight, height, and activity."
      howToUse={[
        "Enter your age, gender, weight (kg), and height (cm).",
        "Select your activity level from sedentary to very active.",
        "View your BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure).",
      ]}
      faq={[
        { question: "What is BMR?", answer: "BMR (Basal Metabolic Rate) is the number of calories your body needs at complete rest to maintain basic life functions like breathing and circulation." },
        { question: "What is TDEE?", answer: "TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor, representing the total calories you burn in a day including all activities." },
        { question: "How do I use TDEE for weight management?", answer: "To lose weight, eat fewer calories than your TDEE. To gain weight, eat more. A deficit of 500 calories/day roughly equals 1 pound of weight loss per week." },
        { question: "Which formula does this calculator use?", answer: "This calculator uses the Mifflin-St Jeor equation, which is considered the most accurate formula for estimating BMR in healthy adults." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
