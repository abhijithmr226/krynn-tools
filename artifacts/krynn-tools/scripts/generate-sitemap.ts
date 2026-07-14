import fs from "fs/promises";
import path from "path";
import { categories, tools } from "../src/lib/tools.ts";

const BASE_URL = "https://www.krynntools.online";

async function generateSitemap() {
  const urls: string[] = [];

  // 1. Homepage
  urls.push("");

  // 2. Static pages
  const staticPages = [
    "about",
    "contact",
    "blog",
    "trending-news",
    "privacy-policy",
    "terms-of-service",
    "cookie-policy",
    "disclaimer",
  ];
  staticPages.forEach((p) => urls.push(p));

  // 3. Category pages
  categories.forEach((cat) => {
    urls.push(cat.slug);
  });

  // 4. Individual tool pages
  tools.forEach((tool) => {
    urls.push(`${tool.categorySlug}/${tool.slug}`);
  });

  // 5. Blog posts (read directories dynamically)
  const blogSlugs: string[] = [];
  try {
    const blogDir = path.resolve(import.meta.dirname, "../src/app/blog");
    const items = await fs.readdir(blogDir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        blogSlugs.push(item.name);
        urls.push(`blog/${item.name}`);
      }
    }
  } catch (err) {
    console.error("Failed to read blog directory:", err);
  }

  // Generate XML sitemap
  const dateStr = new Date().toISOString().split("T")[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((url) => {
    const loc = url ? `${BASE_URL}/${url}` : `${BASE_URL}/`;
    const isHomepage = url === "";
    const isBlog = url.startsWith("blog/");
    
    // Add image sitemap entries for blog posts
    let imageTag = "";
    if (isBlog) {
      const blogSlug = url.replace("blog/", "");
      // Map blog slugs to their image paths
      const imageMap: Record<string, string> = {
        "best-free-online-tools-2026": "/images/blog/compress-pdf.svg",
        "free-grammarly-alternative-offline": "/images/blog/json-formatter.svg",
        "smallpdf-vs-ilovepdf-vs-krynn-tools": "/images/blog/compress-pdf.svg",
        "remove-background-image-free-2026": "/images/blog/remove-background.svg",
        "best-free-image-upscaler-2026": "/images/blog/compress-image.svg",
        "best-free-qr-code-generator-2026": "/images/blog/qr-code-generator.svg",
        "convert-png-to-jpg-free": "/images/blog/compress-image.svg",
        "best-free-resume-builder-2026": "/images/blog/compress-pdf.svg",
        "how-to-compress-pdf-without-losing-quality": "/images/blog/compress-pdf.svg",
        "how-to-merge-multiple-pdfs": "/images/blog/merge-pdf.svg",
        "10-signs-your-password-isnt-strong-enough": "/images/blog/password-generator.svg",
        "qr-codes-explained-static-vs-dynamic": "/images/blog/qr-code-generator.svg",
        "best-practices-for-qr-code-design": "/images/blog/qr-code-generator.svg",
        "how-to-generate-qr-codes-for-business": "/images/blog/qr-code-generator.svg",
        "understanding-error-correction-in-qr-codes": "/images/blog/qr-code-generator.svg",
        "how-to-shrink-image-file-size": "/images/blog/compress-image.svg",
        "how-to-remove-background-from-photo": "/images/blog/remove-background.svg",
        "json-formatting-best-practices": "/images/blog/json-formatter.svg",
        "what-is-base64-encoding": "/images/blog/base64-encoder.svg",
        "bmi-explained-what-numbers-mean": "/images/blog/bmi-calculator.svg",
        "how-emi-is-calculated-on-loan": "/images/blog/loan-emi-calculator.svg",
        "how-to-extract-text-from-scanned-pdfs": "/images/blog/compress-pdf.svg",
        "best-free-dice-roller-for-board-games": "/images/blog/base64-encoder.svg",
        "how-to-crop-passport-size-photos-online": "/images/blog/compress-image.svg",
        "how-to-generate-strong-passwords-online": "/images/blog/password-generator.svg",
        "how-to-convert-text-case-online": "/images/blog/json-formatter.svg",
        "how-to-resize-images-for-social-media": "/images/blog/compress-image.svg",
        "what-is-a-uuid-and-how-to-generate-one": "/images/blog/base64-encoder.svg",
        "how-to-calculate-percentage-online": "/images/blog/bmi-calculator.svg",
        "how-to-convert-units-online": "/images/blog/loan-emi-calculator.svg",
        "how-to-checksum-a-file": "/images/blog/base64-encoder.svg",
        "how-to-count-words-and-characters-online": "/images/blog/json-formatter.svg",
        "how-to-convert-heic-to-jpg": "/images/blog/compress-image.svg",
        "best-free-json-formatter-online": "/images/blog/json-formatter.svg",
        "best-free-password-generator-2026": "/images/blog/password-generator.svg",
        "how-to-ocr-text-from-image": "/images/blog/compress-image.svg",
        "base64-encoder-decoder-explained": "/images/blog/base64-encoder.svg",
      };
      const imgPath = imageMap[blogSlug] || "/images/blog/compress-pdf.svg";
      imageTag = `
    <image:image>
      <image:loc>${BASE_URL}${imgPath}</image:loc>
      <image:title>${blogSlug.replace(/-/g, " ")}</image:title>
    </image:image>`;
    }

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>${isHomepage ? "daily" : "weekly"}</changefreq>
    <priority>${isHomepage ? "1.0" : url.includes("/") ? "0.6" : "0.8"}</priority>${imageTag}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  const publicDest = path.resolve(import.meta.dirname, "../public/sitemap.xml");
  await fs.writeFile(publicDest, xml, "utf-8");
  console.log(`Successfully generated sitemap.xml with ${urls.length} URLs!`);
}

generateSitemap().catch(console.error);
