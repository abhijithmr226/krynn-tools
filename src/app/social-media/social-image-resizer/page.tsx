import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import SocialImageResizerTool from "./SocialImageResizerTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "social-image-resizer")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));

export const metadata: Metadata = {
  title: "Social Media Image Resizer",
  description: "Resize images for Instagram, Facebook, Twitter/X, LinkedIn, and YouTube with preset dimensions. Free, client-side image resizing.",
  keywords: ["social media image resizer", "instagram image resizer", "resize image for social media", "facebook cover resizer", "youtube thumbnail resizer"],
  alternates: { canonical: "https://krynntools.online/social-media/social-image-resizer" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://krynntools.online/social-media/social-image-resizer",
    siteName: "Krynn Tools", title: "Social Media Image Resizer",
    description: "Resize images for all social media platforms with preset dimensions.",
    images: [{ url: "https://krynntools.online/logo.png", width: 1200, height: 630, alt: "Social Media Image Resizer – Krynn Tools" }],
  },
  twitter: { card: "summary_large_image", title: "Social Media Image Resizer", description: "Resize images for all social media platforms.", images: ["https://krynntools.online/logo.png"] },
};

const schema = generateToolSchema(tool);

export default function SocialImageResizerPage() {
  return <SocialImageResizerTool relatedTools={relatedTools} schema={schema} />;
}
