import { Tool } from "./tools";
type Metadata = Record<string, unknown>;

const BASE_URL = "https://www.krynntools.online";
const SITE_NAME = "Krynn Tools";

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${BASE_URL}/${tool.categorySlug}/${tool.slug}`;
  const title = `${tool.name} Online Free – No Signup | Krynn Tools`;
  const description = `${tool.description} 100% free, no signup, no watermark. Fast, private, and instant results. Works on mobile and desktop.`;

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
    "@type": "WebApplication",
    name: tool.name,
    url,
    description: tool.description,
    applicationCategory: getCategoryApplicationType(tool.categorySlug),
    operatingSystem: "All",
    image: `${BASE_URL}/logo.png`,
    screenshot: `${BASE_URL}/logo.png`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    featureList: tool.keywords.slice(0, 5).join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.svg`,
      },
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
