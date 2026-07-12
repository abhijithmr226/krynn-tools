import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Web Design Tools – Free CSS Gradient Generator, Color Palette & More",
  description: "10+ free online web design tools. Generate CSS gradients, box shadows, color palettes, and more.",
};

export default function DesignCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "design" })} />;
}
