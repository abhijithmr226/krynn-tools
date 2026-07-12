import type { Metadata } from "next";
import { Tool } from "./tools";

const BASE_URL = "https://krynntools.online";
const SITE_NAME = "Krynn Tools";

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${BASE_URL}/${tool.categorySlug}/${tool.slug}`;
  const title = `${tool.name} Online Free – ${tool.category}`;
  const description = `${tool.description} Free, fast, and private — runs entirely in your browser. No signup required.`;

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
      title: `${tool.name} Online Free – ${tool.category}`,
      description: `${tool.description} Free, fast, and private.`,
      images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: `${tool.name} – ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} Online Free – ${tool.category}`,
      description: `${tool.description} Free, fast, and private.`,
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
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${BASE_URL}/${tool.categorySlug}/${tool.slug}`,
    description: tool.description,
    applicationCategory: getCategoryApplicationType(tool.categorySlug),
    operatingSystem: "All",
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
  };
  return mapping[categorySlug] || "UtilitiesApplication";
}
