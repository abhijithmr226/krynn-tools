import { Metadata } from "next";
import CategoryPageComponent from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Security Tools – Free Online Password Generator, Hash & QR Code Tools",
  description: "7+ free online security tools. Generate passwords, hashes, QR codes, and check password strength.",
};

export default function SecurityCategoryPage() {
  return <CategoryPageComponent params={Promise.resolve({ slug: "security" })} />;
}
