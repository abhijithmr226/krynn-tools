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

export default function TrendingNewsPage() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('news-bookmarks') || '[]')); } catch { return new Set(); }
  });

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

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('news-bookmarks', JSON.stringify([...next]));
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-accent)]/10 border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC0ydjJoLTJ2LTJoMnptMTItNHYySDI0di0yaDE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-6 border border-[var(--color-primary)]/20">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              Live Updates Every 30 Minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4 tracking-tight">
              Trending <span className="text-[var(--color-primary)]">Tech News</span>
            </h1>
            <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
              Stay ahead with the latest in technology, AI, and cybersecurity. Curated from trusted sources, updated automatically.
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-muted)]">
                {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
                {search && ` matching "${search}"`}
              </p>
              {data && (
                <p className="text-xs text-[var(--color-muted)]">
                  Last updated: {new Date(data.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-16 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
                <p className="text-[var(--color-muted)] mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-opacity">
                  Try Again
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Articles Grid */}
            {!loading && !error && (
              <>
                {visible.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
                    <svg className="w-16 h-16 mx-auto text-[var(--color-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">No articles found</h3>
                    <p className="text-[var(--color-muted)]">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visible.map(article => (
                      <NewsCard key={article.id} article={article} isBookmarked={bookmarks.has(article.id)} onToggleBookmark={toggleBookmark} />
                    ))}
                  </div>
                )}

                {/* Load More */}
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
          </aside>
        </div>
      </div>

      {/* SEO Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Trending Tech News',
        description: 'Latest trending news in technology, AI, and cybersecurity from trusted sources.',
        url: 'https://krynntools.online/trending-news',
        publisher: { '@type': 'Organization', name: 'Krynn Tools', url: 'https://krynntools.online' },
        dateModified: data?.lastUpdated || new Date().toISOString(),
      })}} />
    </div>
  );
}
