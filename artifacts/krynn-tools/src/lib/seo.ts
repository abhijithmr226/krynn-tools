import { Tool } from "./tools";
type Metadata = Record<string, unknown>;

const BASE_URL = "https://www.krynntools.online";
const SITE_NAME = "Krynn Tools";

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${BASE_URL}/${tool.categorySlug}/${tool.slug}`;
  const title = tool.seoTitle || `${tool.name} Free — No Signup, No Upload | Krynn Tools`;
  const description = tool.seoDescription || `${tool.description} 100% free, no signup, no watermark. Runs in your browser — files never uploaded. Fast, private, instant results.`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: `${tool.name} Online Free – No Signup | Krynn Tools`,
      description: `${tool.description} 100% free, no signup, no watermark. Fast, private, and instant results.`,
      images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: `${tool.name} – ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} Online Free – No Signup | Krynn Tools`,
      description: `${tool.description} 100% free, no signup, no watermark. Fast, private, and instant results.`,
      images: [`${BASE_URL}/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function generateToolSchema(tool: Tool): object {
  const url = `${BASE_URL}/${tool.categorySlug}/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} — ${SITE_NAME}`,
    url,
    description: tool.description,
    applicationCategory: getCategoryApplicationType(tool.categorySlug),
    operatingSystem: "Any (Web Browser)",
    image: `${BASE_URL}/logo.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

function getCategoryApplicationType(categorySlug: string): string {
  const mapping: Record<string, string> = {
    pdf: "MultimediaApplication",
    image: "MultimediaApplication",
    text: "UtilitiesApplication",
    dev: "DeveloperApplication",
    design: "DesignApplication",
    calculators: "UtilitiesApplication",
    security: "SecurityApplication",
    misc: "UtilitiesApplication",
    "social-media": "UtilitiesApplication",
    "ai-writing": "UtilitiesApplication",
  };
  return mapping[categorySlug] || "UtilitiesApplication";
}
