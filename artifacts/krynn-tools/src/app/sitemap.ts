import { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.krynntools.online";

function getFileMtime(filePath: string): Date {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

function getBlogSlugs(): string[] {
  const blogDir = path.join(process.cwd(), "src/app/blog");
  return fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(blogDir, d.name, "page.tsx")))
    .map((d) => d.name);
}

function getBlogMtime(slug: string): Date {
  const blogDir = path.join(process.cwd(), "src/app/blog", slug, "page.tsx");
  return getFileMtime(blogDir);
}

function getToolMtime(toolSlug: string, categorySlug: string): Date {
  const toolDir = path.join(process.cwd(), "src/app", categorySlug, toolSlug, "page.tsx");
  return getFileMtime(toolDir);
}

function getCategoryMtime(catSlug: string): Date {
  const catDir = path.join(process.cwd(), "src/app", catSlug, "page.tsx");
  return getFileMtime(catDir);
}

function getStaticPageMtime(pagePath: string): Date {
  const filePath = path.join(process.cwd(), "src/app", pagePath, "page.tsx");
  return getFileMtime(filePath);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: getFileMtime(path.join(process.cwd(), "src/app/page.tsx")), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: getStaticPageMtime("about"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: getStaticPageMtime("contact"), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: getStaticPageMtime("privacy-policy"), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: getStaticPageMtime("terms-of-service"), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: getStaticPageMtime("cookie-policy"), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/disclaimer`, lastModified: getStaticPageMtime("disclaimer"), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: getCategoryMtime(cat.slug),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/${tool.categorySlug}/${tool.slug}`,
    lastModified: getToolMtime(tool.slug, tool.categorySlug),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: getStaticPageMtime("blog"), changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  for (const slug of getBlogSlugs()) {
    blogPages.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: getBlogMtime(slug),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
