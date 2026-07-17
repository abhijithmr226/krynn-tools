import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const BASE_URL = 'https://www.krynntools.online';
const MAX_ARTICLES = 50;

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  image: string;
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

function toRfc822Date(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toUTCString();
}

async function generateNewsRss() {
  const dataPath = path.resolve(import.meta.dirname, '../public/trending-news/data.json');

  let data: NewsData;
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read trending news data:', err);
    process.exit(1);
  }

  const sorted = [...data.articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const recent = sorted.slice(0, MAX_ARTICLES);
  console.log(`Generating RSS feed with ${recent.length} most recent articles (of ${data.articles.length} total)`);

  const now = new Date().toUTCString();

  const items = recent.map(article => {
    const articleUrl = `${BASE_URL}/trending-news/${article.slug}`;
    const pubDate = toRfc822Date(article.publishedAt);
    const categories = article.tags.map(t => `        <category>${escapeXml(t)}</category>`).join('\n');

    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(article.summary)}</description>
      <dc:creator>${escapeXml(article.source)}</dc:creator>
      <pubDate>${pubDate}</pubDate>
${categories}
      <category>${escapeXml(article.category)}</category>
      <source url="${escapeXml(article.sourceUrl)}">${escapeXml(article.source)}</source>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Trending Tech News - Krynn Tools</title>
    <link>${BASE_URL}/trending-news</link>
    <description>Latest trending news in technology, AI, and cybersecurity. Curated from trusted sources, updated automatically.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE_URL}/trending-news/rss.xml" rel="self" type="application/rss+xml" />
    <generator>Krynn Tools News Aggregator</generator>
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>Krynn Tools</title>
      <link>${BASE_URL}</link>
    </image>
${items.join('\n')}
  </channel>
</rss>`;

  const outputPath = path.resolve(import.meta.dirname, '../public/trending-news/rss.xml');
  const distPath = path.resolve(import.meta.dirname, '../dist/public/trending-news/rss.xml');
  await fs.writeFile(outputPath, rss, 'utf-8');
  console.log(`Generated RSS feed with ${recent.length} items at ${outputPath}`);

  if (existsSync(path.resolve(import.meta.dirname, '../dist/public'))) {
    const distNewsDir = path.resolve(import.meta.dirname, '../dist/public/trending-news');
    await fs.mkdir(distNewsDir, { recursive: true });
    await fs.writeFile(distPath, rss, 'utf-8');
    console.log(`Successfully copied RSS feed to build directory at ${distPath}`);
  }
}

generateNewsRss().catch(err => {
  console.error('Failed to generate RSS feed:', err);
  process.exit(1);
});
