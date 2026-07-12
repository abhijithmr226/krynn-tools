import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import InstagramBioCounterTool from "./InstagramBioCounterTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "instagram-bio-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));

export const metadata: Metadata = {
  title: "Instagram Bio & Caption Character Counter",
  description: "Count characters, words, and lines for Instagram bios and captions. Know exactly how much text fits before you post.",
  keywords: ["instagram bio character counter", "instagram caption counter", "instagram text limit", "bio character count"],
  alternates: { canonical: "https://krynntools.online/social-media/instagram-bio-counter" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://krynntools.online/social-media/instagram-bio-counter",
    siteName: "Krynn Tools", title: "Instagram Bio & Caption Character Counter",
    description: "Count characters for Instagram bios and captions. Free and instant.",
    images: [{ url: "https://krynntools.online/logo.png", width: 1200, height: 630, alt: "Instagram Bio Counter – Krynn Tools" }],
  },
  twitter: { card: "summary_large_image", title: "Instagram Bio & Caption Character Counter", description: "Count characters for Instagram bios and captions.", images: ["https://krynntools.online/logo.png"] },
};

const schema = generateToolSchema(tool);

export default function InstagramBioCounterPage() {
  return <InstagramBioCounterTool relatedTools={relatedTools} schema={schema} />;
}
