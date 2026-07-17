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
  // Open Source — use rsshub RSS feeds; no HTML scraping
  { name: 'GitHub Trending', url: 'https://rsshub.app/github/trending/daily/all', category: 'Open Source' },
  { name: 'GitHub Trending TS', url: 'https://rsshub.app/github/trending/daily/typescript', category: 'Open Source' },
  { name: 'GitHub Trending Python', url: 'https://rsshub.app/github/trending/daily/python', category: 'Open Source' },
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage?count=30', category: 'Open Source' },
];

const MAX_ARTICLES = 200;
const DEDUP_WINDOW_HOURS = 24;
/** Max concurrent AI summary calls — prevents rate-limit bans */
const AI_CONCURRENCY = 5;

// ─── Robust XML/RSS parser (no external deps) ───────────────────────────────

/**
 * Extract CDATA or plain text value from an XML tag, handling:
 *   - CDATA sections: <tag><![CDATA[...]]></tag>
 *   - Namespaced tags: <content:encoded>
 *   - Attributes in opening tag: <link rel="...">
 *   - Atom <entry> as well as RSS <item>
 */
function getTagValue(xml, tag) {
  // Try CDATA first
  const cdataRe = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`,
    'i'
  );
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1].trim();

  // Plain text
  const plainRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const plainMatch = xml.match(plainRe);
  if (plainMatch) return plainMatch[1].trim();

  return '';
}

/** Extract URL from <enclosure url="...">, <media:content url="...">, or <link href="..."> */
function getUrl(block) {
  const enclosure = block.match(/<enclosure[^>]+url="([^"]+)"/i);
  if (enclosure) return enclosure[1];
  const media = block.match(/<media:content[^>]+url="([^"]+)"/i);
  if (media) return media[1];
  // Atom <link href="...">
  const atomLink = block.match(/<link[^>]+href="([^"]+)"/i);
  if (atomLink) return atomLink[1];
  return '';
}

/** Decode common HTML entities */
function decodeHTML(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Strip all HTML tags and collapse whitespace */
function stripHTML(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parse both RSS 2.0 (<item>) and Atom 1.0 (<entry>) feeds.
 * Returns a normalised array of article objects.
 */
function parseFeed(xml) {
  const items = [];

  // Detect format: Atom uses <entry>, RSS uses <item>
  const itemTag = /<entry[\s>]/i.test(xml) ? 'entry' : 'item';
  const itemRe = new RegExp(`<${itemTag}[\\s>]([\\s\\S]*?)<\\/${itemTag}>`, 'gi');

  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];

    const rawTitle = getTagValue(block, 'title');
    const title = decodeHTML(stripHTML(rawTitle));

    // RSS: <link> is a plain URL; Atom: <link href="..."/>
    let link = getTagValue(block, 'link');
    if (!link) link = getUrl(block);
    link = decodeHTML(link.trim());

    // pubDate (RSS) or published/updated (Atom)
    const pubDate =
      getTagValue(block, 'pubDate') ||
      getTagValue(block, 'published') ||
      getTagValue(block, 'updated') ||
      '';

    const rawDesc =
      getTagValue(block, 'description') ||
      getTagValue(block, 'summary') ||
      '';
    const description = stripHTML(decodeHTML(rawDesc));

    const rawContent =
      getTagValue(block, 'content:encoded') ||
      getTagValue(block, 'content') ||
      rawDesc;
    const content = stripHTML(decodeHTML(rawContent));

    // Image: enclosure > media:content > first <img> in content
    let image = getUrl(block);
    if (!image) {
      const imgMatch = rawContent.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) image = imgMatch[1];
    }

    if (title && link) {
      items.push({ title, link, pubDate, description, content, image: image || '' });
    }
  }
  return items;
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

// ─── AI Summary (OpenRouter) ─────────────────────────────────────────────────

async function generateAISummary(title, description, content) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return description.slice(0, 300) || title;
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
    }
    console.log(`  AI summary failed (${res.status}) for: ${title.slice(0, 50)}`);
  } catch (e) {
    console.log(`  AI summary error for: ${title.slice(0, 50)} — ${e.message}`);
  }
  return description.slice(0, 300) || title;
}

/**
 * Run async tasks with max AI_CONCURRENCY in-flight at a time.
 * Prevents overwhelming the OpenRouter rate limit.
 */
async function withConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ─── Feed fetching ───────────────────────────────────────────────────────────

/** Fetch one RSS/Atom feed with timeout + retry (1 retry on transient failure) */
async function fetchFeed(feed, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'KrynnTools-Bot/1.0 (+https://krynntools.online)' },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        if (attempt < retries) continue;
        return [];
      }
      const xml = await res.text();
      return parseFeed(xml).map(item => ({ ...item, source: feed.name, category: feed.category }));
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // backoff
        continue;
      }
      return [];
    }
  }
  return [];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching RSS/Atom feeds...');

  const outPath = join(process.cwd(), 'public', 'trending-news', 'data.json');

  // Load existing URLs for deduplication
  let existingUrls = new Set();
  let existingArticles = [];
  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, 'utf-8'));
      existingArticles = existing.articles || [];
      existingArticles.forEach(a =>
        existingUrls.add(a.sourceUrl?.replace(/\/$/, '').toLowerCase())
      );
      console.log(`Loaded ${existingUrls.size} existing articles for dedup`);
    } catch { /* fresh start */ }
  }

  // Fetch all feeds concurrently
  const results = await Promise.allSettled(RSS_FEEDS.map(feed => fetchFeed(feed)));
  const allArticles = results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
  console.log(`Fetched ${allArticles.length} raw articles from ${RSS_FEEDS.length} feeds`);

  // Deduplicate against existing + within batch
  const seen = new Set(existingUrls);
  const unique = allArticles.filter(a => {
    const key = a.link.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`After dedup: ${unique.length} new articles`);

  // Filter to recent articles only
  const cutoff = Date.now() - DEDUP_WINDOW_HOURS * 60 * 60 * 1000;
  const recent = unique.filter(a => {
    const d = new Date(a.pubDate).getTime();
    return !isNaN(d) && d > cutoff;
  });
  console.log(`Recent (${DEDUP_WINDOW_HOURS}h): ${recent.length} articles`);

  // Sort newest first, take top N
  recent.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const top = recent.slice(0, MAX_ARTICLES);

  // Generate AI summaries with controlled concurrency
  console.log(`Generating AI summaries (${AI_CONCURRENCY} concurrent)...`);
  const processed = await withConcurrency(top, AI_CONCURRENCY, async (a, i) => {
    const summary = await generateAISummary(a.title, a.description, a.content);
    if ((i + 1) % 10 === 0) console.log(`  Processed ${i + 1}/${top.length}`);
    return {
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
    };
  });

  // Merge with existing (new articles first), dedup, filter old, keep top 200
  const allMerged = [...processed, ...existingArticles];
  const finalIds = new Set();
  const final = allMerged
    .filter(a => {
      if (finalIds.has(a.id)) return false;
      finalIds.add(a.id);
      const d = new Date(a.publishedAt).getTime();
      return !isNaN(d) && d > cutoff;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 200);

  // Write output
  const outDir = join(process.cwd(), 'public', 'trending-news');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify({ lastUpdated: new Date().toISOString(), totalArticles: final.length, articles: final }, null, 2)
  );
  console.log(`✓ Saved ${final.length} articles to ${outPath}`);
}

main().catch(console.error);
