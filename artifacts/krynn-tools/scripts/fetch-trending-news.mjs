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
  // Open Source / GitHub
  { name: 'GitHub Trending', url: 'https://rsshub.app/github/trending/daily/all', category: 'Open Source' },
  { name: 'GitHub Trending TS', url: 'https://rsshub.app/github/trending/daily/typescript', category: 'Open Source' },
  { name: 'GitHub Trending Python', url: 'https://rsshub.app/github/trending/daily/python', category: 'Open Source' },
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage?count=30', category: 'Open Source' },
];

const MAX_ARTICLES = 200;
const DEDUP_WINDOW_HOURS = 24;

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

// OpenRouter API (OpenAI-compatible)
async function generateAISummary(title, description, content) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return description.slice(0, 300) || title;
  }
  try {
    const prompt = `Write a 2-3 sentence summary of this news article. Be factual, concise, and engaging. Do not fabricate any information.\n\nTitle: ${title}\n\nContent: ${(content || description).slice(0, 2000)}`;
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://krynntools.online',
        'X-Title': 'Krynn Tools News',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || description.slice(0, 300);
    } else {
      console.log(`  AI summary failed (${res.status}) for: ${title.slice(0, 50)}`);
    }
  } catch (e) {
    console.log(`  AI summary error for: ${title.slice(0, 50)} - ${e.message}`);
  }
  return description.slice(0, 300) || title;
}

async function fetchFeed(feed) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
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

// Fetch GitHub Trending via HTML scraping as fallback
async function fetchGitHubTrending() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch('https://github.com/trending', {
      signal: controller.signal,
      headers: { 'User-Agent': 'KrynnTools-Bot/1.0 (+https://krynntools.online)' },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const html = await res.text();

    const repos = [];
    const repoRegex = /<h2 class="h3[^"]*">\s*<a href="\/([^"]+)"/g;
    const descRegex = /<p class="col-9[^"]*">([\s\S]*?)<\/p>/g;
    const starsRegex = /<span class="d-inline-block float-sm-right">\s*([\s\S]*?)\s*<\/span>/g;

    let match;
    const names = [];
    while ((match = repoRegex.exec(html)) !== null) {
      names.push(match[1].trim());
    }

    const descriptions = [];
    while ((match = descRegex.exec(html)) !== null) {
      descriptions.push(cleanHTML(match[1]));
    }

    for (let i = 0; i < names.length; i++) {
      repos.push({
        title: `GitHub Trending: ${names[i]}`,
        link: `https://github.com/${names[i]}`,
        pubDate: new Date().toISOString(),
        description: descriptions[i] || `Trending repository on GitHub: ${names[i]}`,
        content: descriptions[i] || `Trending repository on GitHub: ${names[i]}`,
        image: '',
        source: 'GitHub Trending',
        category: 'Open Source',
      });
    }
    return repos;
  } catch {
    return [];
  }
}

async function main() {
  console.log('Fetching RSS feeds...');

  // Load existing data for incremental updates
  const outPath = join(process.cwd(), 'public', 'trending-news', 'data.json');
  let existingUrls = new Set();
  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
      existing.articles.forEach(a => existingUrls.add(a.sourceUrl?.replace(/\/$/, '').toLowerCase()));
      console.log(`Loaded ${existingUrls.size} existing articles for dedup`);
    } catch { /* fresh start */ }
  }

  const allArticles = [];

  // Fetch all RSS feeds
  const results = await Promise.allSettled(RSS_FEEDS.map(feed => fetchFeed(feed)));
  for (const result of results) {
    if (result.status === 'fulfilled') allArticles.push(...result.value);
  }

  // Fetch GitHub Trending
  const ghArticles = await fetchGitHubTrending();
  allArticles.push(...ghArticles);

  console.log(`Fetched ${allArticles.length} raw articles`);

  // Deduplicate by URL (including against existing data)
  const seen = new Set(existingUrls);
  const unique = allArticles.filter(a => {
    const key = a.link.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`After dedup: ${unique.length} new articles`);

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
  console.log('Generating AI summaries via OpenRouter...');
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

  // Merge with existing articles (keep existing, add new)
  let existingArticles = [];
  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
      existingArticles = existing.articles || [];
    } catch { /* fresh start */ }
  }

  const allMerged = [...processed, ...existingArticles];
  // Final dedup by id
  const finalIds = new Set();
  const final = allMerged.filter(a => {
    if (finalIds.has(a.id)) return false;
    finalIds.add(a.id);
    return true;
  });
  // Filter out any articles older than the cutoff (guarantees only fresh news is kept)
  const finalRecent = final.filter(a => {
    const d = new Date(a.publishedAt).getTime();
    return !isNaN(d) && d > cutoff;
  });
  // Sort all by date
  finalRecent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  // Keep top 200
  const finalTop = finalRecent.slice(0, 200);

  // Save
  const outDir = join(process.cwd(), 'public', 'trending-news');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify({ lastUpdated: new Date().toISOString(), totalArticles: finalTop.length, articles: finalTop }, null, 2));
  console.log(`Saved ${finalTop.length} articles to ${outPath}`);
}

main().catch(console.error);
