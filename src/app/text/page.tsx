import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Text Tools – Free Online Word Counter, Case Converter & More",
  description: "15+ free online text tools. Count words, convert case, sort text, generate content, and more. Works in your browser.",
};

export default function TextCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "text" })} />;
}
