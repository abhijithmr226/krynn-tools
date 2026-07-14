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
    "privacy-policy",
    "terms-of-service",
    "cookie-policy",
    "disclaimer",
    "search",
    "settings",
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
  try {
    const blogDir = path.resolve(import.meta.dirname, "../src/app/blog");
    const items = await fs.readdir(blogDir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        urls.push(`blog/${item.name}`);
      }
    }
  } catch (err) {
    console.error("Failed to read blog directory:", err);
  }

  // Generate XML sitemap
  const dateStr = new Date().toISOString().split("T")[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    const loc = url ? `${BASE_URL}/${url}` : `${BASE_URL}/`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>${url === "" ? "daily" : "weekly"}</changefreq>
    <priority>${url === "" ? "1.0" : url.includes("/") ? "0.6" : "0.8"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  const publicDest = path.resolve(import.meta.dirname, "../public/sitemap.xml");
  await fs.writeFile(publicDest, xml, "utf-8");
  console.log(`Successfully generated sitemap.xml with ${urls.length} URLs!`);
}

generateSitemap().catch(console.error);
