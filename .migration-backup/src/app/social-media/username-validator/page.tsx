import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import UsernameValidatorTool from "./UsernameValidatorTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "username-validator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));

export const metadata: Metadata = {
  title: "Instagram Username Validator & Format Checker",
  description: "Check if an Instagram username meets format requirements. Validate username length, characters, and format rules instantly.",
  keywords: ["instagram username validator", "username format checker", "instagram username rules", "check username format"],
  alternates: { canonical: "https://www.krynntools.online/social-media/username-validator" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://www.krynntools.online/social-media/username-validator",
    siteName: "Krynn Tools", title: "Instagram Username Validator",
    description: "Check if a username meets Instagram format requirements.",
    images: [{ url: "https://www.krynntools.online/logo.png", width: 1200, height: 630, alt: "Username Validator – Krynn Tools" }],
  },
  twitter: { card: "summary_large_image", title: "Instagram Username Validator", description: "Check if a username meets Instagram format requirements.", images: ["https://www.krynntools.online/logo.png"] },
};

const schema = generateToolSchema(tool);

export default function UsernameValidatorPage() {
  return <UsernameValidatorTool relatedTools={relatedTools} schema={schema} />;
}
