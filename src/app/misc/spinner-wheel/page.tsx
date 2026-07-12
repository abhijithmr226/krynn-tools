import { Metadata } from "next";
import { getRelatedTools, getTool } from "@/lib/tools";
import SpinnerWheelTool from "./SpinnerWheelTool";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("misc", "spinner-wheel")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata: Metadata = {
  title: "Custom Spinner Wheel – Random Picker",
  description: "Add custom options and spin the wheel to pick a random winner. Perfect for giveaways, team selection, and decision making. 100% free, client-side.",
  keywords: ["spin the wheel", "random picker", "wheel spinner online", "random name picker", "decision maker", "giveaway spinner"],
  alternates: { canonical: "https://krynntools.online/misc/spinner-wheel" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://krynntools.online/misc/spinner-wheel",
    siteName: "Krynn Tools",
    title: "Custom Spinner – Spin the Wheel Random Picker",
    description: "Add custom options and spin the wheel to pick a random winner. Free, fair, and private.",
    images: [{ url: "https://krynntools.online/logo.png", width: 1200, height: 630, alt: "Spinner Wheel – Krynn Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Spinner – Spin the Wheel Random Picker",
    description: "Add custom options and spin the wheel to pick a random winner. Free, fair, and private.",
    images: ["https://krynntools.online/logo.png"],
  },
};

const schema = generateToolSchema(tool);

export default function SpinnerWheelPage() {
  return <SpinnerWheelTool relatedTools={relatedTools} schema={schema} />;
}
