import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const BASE_URL = 'https://www.krynntools.online';
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

interface NewsArticle {
  slug: string;
  title: string;
  source: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

interface NewsData {
  lastUpdated: string;
  totalArticles: number;
  articles: NewsArticle[];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateNewsSitemap() {
  const dataPath = path.resolve(import.meta.dirname, '../public/trending-news/data.json');

  let data: NewsData;
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read trending news data:', err);
    process.exit(1);
  }

  const now = Date.now();
  const cutoff = now - FORTY_EIGHT_HOURS_MS;

  const recentArticles = data.articles.filter(a => {
    const published = new Date(a.publishedAt).getTime();
    return !isNaN(published) && published > cutoff;
  });

  console.log(`Found ${recentArticles.length} articles from the last 48 hours (of ${data.articles.length} total)`);

  if (recentArticles.length === 0) {
    console.log('No recent articles found. Skipping sitemap generation.');
    return;
  }

  const allCategories = [...new Set(data.articles.map(a => a.category))];

  const urlEntries = recentArticles.map(article => {
    const articleUrl = `${BASE_URL}/trending-news/${article.slug}`;
    const pubDate = new Date(article.publishedAt).toISOString();
    const keywords = [...article.tags, article.category].join(', ');

    return `  <url>
    <loc>${escapeXml(articleUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>Krynn Tools</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:title>${escapeXml(article.title)}</news:title>
      <news:publication_date>${escapeXml(pubDate)}</news:publication_date>
      <news:keywords>${escapeXml(keywords)}</news:keywords>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries.join('\n')}
</urlset>`;

  const outputPath = path.resolve(import.meta.dirname, '../public/trending-news/sitemap.xml');
  const distPath = path.resolve(import.meta.dirname, '../dist/public/trending-news/sitemap.xml');
  await fs.writeFile(outputPath, xml, 'utf-8');
  console.log(`Generated news sitemap with ${recentArticles.length} URLs at ${outputPath}`);

  if (existsSync(path.resolve(import.meta.dirname, '../dist/public'))) {
    const distNewsDir = path.resolve(import.meta.dirname, '../dist/public/trending-news');
    await fs.mkdir(distNewsDir, { recursive: true });
    await fs.writeFile(distPath, xml, 'utf-8');
    console.log(`Successfully copied news sitemap to build directory at ${distPath}`);
  }

  const categories = allCategories.join(', ');
  console.log(`All categories tracked: ${categories}`);
}

generateNewsSitemap().catch(err => {
  console.error('Failed to generate news sitemap:', err);
  process.exit(1);
});
