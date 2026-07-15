import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'wouter';
import type { NewsArticle, NewsData } from './types';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import TrendingSidebar from './TrendingSidebar';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import NewsletterSignup from './NewsletterSignup';

const ARTICLES_PER_PAGE = 12;

const toolLinks: Record<string, { name: string; href: string }[]> = {
  Technology: [
    { name: 'Compress PDF', href: '/pdf/compress-pdf' },
    { name: 'Image Compressor', href: '/image/compress-image' },
    { name: 'QR Code Generator', href: '/design/qr-code-generator' },
  ],
  AI: [
    { name: 'AI Writing Assistant', href: '/ai-writing/ai-writing-assistant' },
    { name: 'AI Summarizer', href: '/ai-writing/ai-summarizer' },
    { name: 'Grammar Checker', href: '/text/grammar-fixer' },
  ],
  Cybersecurity: [
    { name: 'Password Generator', href: '/security/password-generator' },
    { name: 'Hash Generator', href: '/security/hash-generator' },
    { name: 'Hash Checker', href: '/security/hash-checker' },
  ],
  'Open Source': [
    { name: 'JSON Formatter', href: '/dev/json-formatter' },
    { name: 'Base64 Encoder', href: '/dev/base64-encoder' },
    { name: 'UUID Generator', href: '/dev/uuid-generator' },
  ],
};

export default function TrendingNewsPage() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  useEffect(() => {
    fetch('/trending-news/data.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load news. Please try again later.'); setLoading(false); });
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    const counts: Record<string, number> = { All: data.articles.length };
    data.articles.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let articles = data.articles;
    if (activeCategory !== 'All') articles = articles.filter(a => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return articles;
  }, [data, activeCategory, search]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => setVisibleCount(prev => prev + ARTICLES_PER_PAGE), []);

  useEffect(() => { setVisibleCount(ARTICLES_PER_PAGE); }, [activeCategory, search]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMore]);

  const currentTools = activeCategory !== 'All' ? (toolLinks[activeCategory] || []) : [];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-accent)]/10 border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC0ydjJoLTJ2LTJoMnptMTItNHYySDI0di0yaDE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
              <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[var(--color-foreground)]">Trending News</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-6 border border-[var(--color-primary)]/20">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              Live Updates Every 30 Minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4 tracking-tight">
              Trending <span className="text-[var(--color-primary)]">Tech News</span>
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
              Stay ahead with the latest in technology, AI, and cybersecurity. Curated from TechCrunch, The Verge, WIRED, and more — updated automatically every 30 minutes.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar value={search} onChange={setSearch} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* Internal Links Bar - SEO */}
        {currentTools.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">Related Tools</p>
            <div className="flex flex-wrap gap-2">
              {currentTools.map(tool => (
                <Link key={tool.href} href={tool.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-muted)] text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all">
                  {tool.name}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
                {search && ` matching "${search}"`}
              </p>
              {data && (
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Updated: {new Date(data.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>

            {error && (
              <div className="text-center py-16 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
                <p className="text-[var(--color-muted-foreground)] mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-opacity">
                  Try Again
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && !error && (
              <>
                {visible.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
                    <svg className="w-16 h-16 mx-auto text-[var(--color-muted-foreground)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">No articles found</h3>
                    <p className="text-[var(--color-muted-foreground)]">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visible.map(article => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="text-center mt-8">
                    <button onClick={loadMore} className="px-8 py-3 bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded-xl hover:bg-[var(--color-card-hover)] transition-all font-medium">
                      Load More ({filtered.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <TrendingSidebar articles={data?.articles || []} />
            <NewsletterSignup />

            {/* Sidebar: Popular Tools */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
              <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-3">Popular Tools</h3>
              <div className="space-y-2">
                {[
                  { name: 'Compress PDF', href: '/pdf/compress-pdf', cat: 'PDF' },
                  { name: 'Remove Background', href: '/image/remove-background', cat: 'Image' },
                  { name: 'Password Generator', href: '/security/password-generator', cat: 'Security' },
                  { name: 'JSON Formatter', href: '/dev/json-formatter', cat: 'Developer' },
                  { name: 'AI Writing Assistant', href: '/ai-writing/ai-writing-assistant', cat: 'AI' },
                ].map(tool => (
                  <Link key={tool.href} href={tool.href} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors group">
                    <span className="text-sm font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{tool.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">{tool.cat}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* SEO: CollectionPage + ItemList structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Trending Tech News — AI, Technology & Cybersecurity',
        description: 'Latest trending news in technology, AI, and cybersecurity curated from TechCrunch, The Verge, WIRED, MIT Technology Review, and more. Updated every 30 minutes.',
        url: 'https://www.krynntools.online/trending-news',
        publisher: {
          '@type': 'Organization',
          name: 'Krynn Tools',
          url: 'https://www.krynntools.online',
          logo: { '@type': 'ImageObject', url: 'https://www.krynntools.online/logo.png' },
        },
        dateModified: data?.lastUpdated || new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.krynntools.online' },
            { '@type': 'ListItem', position: 2, name: 'Trending News', item: 'https://www.krynntools.online/trending-news' },
          ],
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: data?.totalArticles || 0,
          itemListElement: (data?.articles || []).slice(0, 20).map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.krynntools.online/trending-news/${a.slug}`,
          })),
        },
      })}} />

      {/* RSS autodiscovery */}
      <link rel="alternate" type="application/rss+xml" title="Krynn Tools Trending News" href="https://www.krynntools.online/trending-news/rss.xml" />
    </div>
  );
}
