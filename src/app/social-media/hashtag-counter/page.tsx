import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import HashtagCounterTool from "./HashtagCounterTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "hashtag-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));

export const metadata: Metadata = {
  title: "Hashtag Counter for Instagram & TikTok",
  description: "Count hashtags in your text and get suggestions. Perfect for Instagram, TikTok, and Twitter posts. Know your hashtag limits.",
  keywords: ["hashtag counter", "instagram hashtag counter", "hashtag generator", "count hashtags online", "hashtag limit checker"],
  alternates: { canonical: "https://krynntools.online/social-media/hashtag-counter" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://krynntools.online/social-media/hashtag-counter",
    siteName: "Krynn Tools", title: "Hashtag Counter & Generator",
    description: "Count hashtags and generate hashtag sets for social media posts.",
    images: [{ url: "https://krynntools.online/logo.png", width: 1200, height: 630, alt: "Hashtag Counter – Krynn Tools" }],
  },
  twitter: { card: "summary_large_image", title: "Hashtag Counter & Generator", description: "Count hashtags and generate hashtag sets.", images: ["https://krynntools.online/logo.png"] },
};

const schema = generateToolSchema(tool);

export default function HashtagCounterPage() {
  return <HashtagCounterTool relatedTools={relatedTools} schema={schema} />;
}
