import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { categories, tools } from "../src/lib/tools.ts";
import { blogPosts } from "../src/lib/blog-data.ts";

const BASE_URL = "https://www.krynntools.online";

/** Convert a human-readable date string to ISO 8601 YYYY-MM-DD */
function toIsoDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
  return new Date().toISOString().split("T")[0];
}

async function generateSitemap() {
  const todayStr = new Date().toISOString().split("T")[0];

  // Build a slug→post lookup for efficient access
  const blogPostMap = new Map(blogPosts.map((p) => [p.slug, p]));

  interface SitemapEntry {
    url: string;
    lastmod: string;
    changefreq: string;
    priority: string;
    imageTag?: string;
  }

  const entries: SitemapEntry[] = [];

  // 1. Homepage
  entries.push({ url: "", lastmod: todayStr, changefreq: "daily", priority: "1.0" });

  // 2. Static pages
  const staticPages: { slug: string; date?: string }[] = [
    { slug: "about" },
    { slug: "contact" },
    { slug: "blog" },
    { slug: "trending-news" },
    { slug: "privacy-policy" },
    { slug: "terms-of-service" },
    { slug: "cookie-policy" },
    { slug: "disclaimer" },
    // Comparison landing pages — high-intent SEO targets
    { slug: "ilovepdf-alternative" },
    { slug: "smallpdf-alternative" },
  ];
  const comparisonSlugs = new Set(["ilovepdf-alternative", "smallpdf-alternative"]);
  staticPages.forEach(({ slug }) => {
    const isComparison = comparisonSlugs.has(slug);
    entries.push({
      url: slug,
      lastmod: todayStr,
      changefreq: isComparison ? "weekly" : "monthly",
      priority: isComparison ? "0.8" : "0.5",
    });
  });

  // 3. Category pages
  categories.forEach((cat) => {
    entries.push({ url: cat.slug, lastmod: todayStr, changefreq: "weekly", priority: "0.8" });
  });

  // 4. Individual tool pages
  tools.forEach((tool) => {
    entries.push({
      url: `${tool.categorySlug}/${tool.slug}`,
      lastmod: todayStr,
      changefreq: "weekly",
      priority: "0.6",
    });
  });

  // 5. Blog posts — use real publication dates from blog-data.ts
  try {
    const blogDir = path.resolve(import.meta.dirname, "../src/app/blog");
    const items = await fs.readdir(blogDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        const slug = item.name;
        const post = blogPostMap.get(slug);
        const lastmod = post ? toIsoDate(post.date) : todayStr;
        const imagePath = post?.image || "/images/blog/compress-pdf.png";
        // Convert .png extension to use absolute URL; keep as-is otherwise
        const imageUrl = imagePath.startsWith("/") ? `${BASE_URL}${imagePath}` : imagePath;
        const imageTitle = post?.title || slug.replace(/-/g, " ");

        entries.push({
          url: `blog/${slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.7",
          imageTag: `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>
    </image:image>`,
        });
      }
    }
  } catch (err) {
    console.error("Failed to read blog directory:", err);
  }

  // 6. Trending news articles (from data.json) — use real publishedAt dates
  try {
    const newsDataPath = path.resolve(import.meta.dirname, "../public/trending-news/data.json");
    const newsData = JSON.parse(await fs.readFile(newsDataPath, "utf-8"));
    for (const article of newsData.articles || []) {
      if (article.slug) {
        const lastmod = article.publishedAt
          ? new Date(article.publishedAt).toISOString().split("T")[0]
          : todayStr;
        entries.push({
          url: `trending-news/${article.slug}`,
          lastmod,
          changefreq: "daily",
          priority: "0.9",
        });
      }
    }
  } catch {
    console.log("No trending news data found, skipping news article URLs");
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(({ url, lastmod, changefreq, priority, imageTag }) => {
    const loc = url ? `${BASE_URL}/${url}` : `${BASE_URL}/`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag || ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  const publicDest = path.resolve(import.meta.dirname, "../public/sitemap.xml");
  const distDest = path.resolve(import.meta.dirname, "../dist/public/sitemap.xml");

  await fs.writeFile(publicDest, xml, "utf-8");
  console.log(`✓ Generated sitemap.xml with ${entries.length} URLs at ${publicDest}`);

  if (existsSync(path.resolve(import.meta.dirname, "../dist/public"))) {
    await fs.writeFile(distDest, xml, "utf-8");
    console.log(`✓ Copied sitemap.xml to build directory`);
  }
}

generateSitemap().catch(console.error);
