import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Developer Tools – Free Online JSON Formatter, Base64 Encoder & More",
  description: "15+ free online developer tools. Format JSON, encode Base64, generate UUIDs, test regex, and more.",
};

export default function DevCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "dev" })} />;
}
