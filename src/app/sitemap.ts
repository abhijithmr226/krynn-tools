import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

const BASE_URL = "https://krynntools.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/${tool.categorySlug}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages = [
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog/how-to-compress-pdf-without-losing-quality`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-merge-multiple-pdfs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/10-signs-your-password-isnt-strong-enough`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/qr-codes-explained-static-vs-dynamic`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-shrink-image-file-size`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-remove-background-from-photo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/json-formatting-best-practices`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/what-is-base64-encoding`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/bmi-explained-what-numbers-mean`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-emi-is-calculated-on-loan`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-generate-qr-codes-for-business`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/best-practices-for-qr-code-design`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/understanding-error-correction-in-qr-codes`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-extract-text-from-scanned-pdfs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/best-free-dice-roller-for-board-games`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/blog/how-to-crop-passport-size-photos-online`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
