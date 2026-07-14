import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const RSS_FEEDS = [
  // Technology
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Technology' },
  { name: 'WIRED', url: 'https://www.wired.com/feed/rss', category: 'Technology' },
  // AI
  { name: 'OpenAI News', url: 'https://openai.com/blog/rss.xml', category: 'AI' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'AI' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'AI' },
  // Cybersecurity
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', category: 'Cybersecurity' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'Cybersecurity' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'Cybersecurity' },
  { name: 'SecurityWeek', url: 'https://feeds.feedburner.com/securityweek', category: 'Cybersecurity' },
];

const MAX_ARTICLES = 150;
const DEDUP_WINDOW_HOURS = 48;

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');
    const description = extractTag(block, 'description');
    const content = extractTag(block, 'content:encoded') || description;
    const enclosure = extractEnclosure(block);
    if (title && link) {
      items.push({ title: decodeHTML(title), link: decodeHTML(link), pubDate, description: cleanHTML(decodeHTML(description || '')), content: cleanHTML(decodeHTML(content || '')), image: enclosure });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 's');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractEnclosure(xml) {
  const match = xml.match(/<enclosure[^>]+url="([^"]+)"/);
  if (match) return match[1];
  const imgMatch = xml.match(/<media:content[^>]+url="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
  const ogMatch = xml.match(/<img[^>]+src="([^"]+)"/);
  return ogMatch ? ogMatch[1] : '';
}

function decodeHTML(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#\d+;/g, '');
}

function cleanHTML(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function generateId(url) {
  return createHash('md5').update(url).digest('hex').slice(0, 12);
}

async function generateAISummary(title, description, content) {
  if (!process.env.OPENAI_API_KEY) {
    return description.slice(0, 300) || title;
  }
  try {
    const prompt = `Write a 2-3 sentence summary of this news article. Be factual, concise, and engaging. Do not fabricate any information.\n\nTitle: ${title}\n\nContent: ${(content || description).slice(0, 2000)}`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.3 }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || description.slice(0, 300);
    }
  } catch { /* fallback */ }
  return description.slice(0, 300) || title;
}

async function fetchFeed(feed) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'KrynnTools-Bot/1.0 (+https://krynntools.online)' },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml).map(item => ({ ...item, source: feed.name, category: feed.category }));
  } catch {
    return [];
  }
}

async function main() {
  console.log('Fetching RSS feeds...');
  const allArticles = [];

  const results = await Promise.allSettled(RSS_FEEDS.map(feed => fetchFeed(feed)));
  for (const result of results) {
    if (result.status === 'fulfilled') allArticles.push(...result.value);
  }
  console.log(`Fetched ${allArticles.length} raw articles`);

  // Deduplicate by URL
  const seen = new Set();
  const unique = allArticles.filter(a => {
    const key = a.link.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`After dedup: ${unique.length} articles`);

  // Filter out old articles
  const cutoff = Date.now() - DEDUP_WINDOW_HOURS * 60 * 60 * 1000;
  const recent = unique.filter(a => {
    const d = new Date(a.pubDate).getTime();
    return !isNaN(d) && d > cutoff;
  });
  console.log(`Recent (${DEDUP_WINDOW_HOURS}h): ${recent.length} articles`);

  // Sort by date (newest first)
  recent.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Take top N
  const top = recent.slice(0, MAX_ARTICLES);

  // Generate AI summaries
  console.log('Generating AI summaries...');
  const processed = [];
  for (let i = 0; i < top.length; i++) {
    const a = top[i];
    const summary = await generateAISummary(a.title, a.description, a.content);
    processed.push({
      id: generateId(a.link),
      slug: generateSlug(a.title),
      title: a.title,
      summary,
      source: a.source,
      sourceUrl: a.link,
      publishedAt: a.pubDate,
      category: a.category,
      tags: [a.category.toLowerCase(), a.source.toLowerCase().replace(/\s+/g, '-')],
      readTime: estimateReadTime(a.content || a.description),
      image: a.image || '',
    });
    if ((i + 1) % 10 === 0) console.log(`  Processed ${i + 1}/${top.length}`);
  }

  // Save
  const outDir = join(process.cwd(), 'public', 'trending-news');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'data.json');
  writeFileSync(outPath, JSON.stringify({ lastUpdated: new Date().toISOString(), totalArticles: processed.length, articles: processed }, null, 2));
  console.log(`Saved ${processed.length} articles to ${outPath}`);
}

main().catch(console.error);
