import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Calculators – Free Online BMI, Age, Percentage & EMI Calculators",
  description: "15+ free online calculators. BMI, age, percentage, loan EMI, compound interest, and more. Instant results.",
};

export default function CalculatorsCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "calculators" })} />;
}
