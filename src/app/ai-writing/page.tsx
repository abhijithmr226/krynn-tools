import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "AI Writing Tools – Free Online AI Essay, Blog & Content Generators",
  description: "12+ free AI writing tools. Generate essays, blog posts, social media content, and more with AI-powered assistance. No signup required.",
};

export default function AiWritingCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "ai-writing" })} />;
}
