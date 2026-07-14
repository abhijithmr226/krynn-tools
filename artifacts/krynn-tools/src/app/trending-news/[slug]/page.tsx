import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'wouter';
import type { NewsArticle, NewsData } from '../types';
import ShareButtons from '../ShareButtons';

const BASE_URL = 'https://www.krynntools.online';

export default function TrendingArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/trending-news/data.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load news data.');
        setLoading(false);
      });
  }, []);

  const article = useMemo(() => {
    if (!data || !slug) return null;
    return data.articles.find(a => a.slug === slug) || null;
  }, [data, slug]);

  const relatedArticles = useMemo(() => {
    if (!data || !article) return [];
    return data.articles
      .filter(a => a.category === article.category && a.id !== article.id)
      .slice(0, 4);
  }, [data, article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 rounded bg-[var(--color-muted)]" />
            <div className="h-8 w-3/4 rounded bg-[var(--color-muted)]" />
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-[var(--color-muted)]" />
              <div className="h-4 w-32 rounded bg-[var(--color-muted)]" />
            </div>
            <div className="aspect-[16/9] w-full rounded-2xl bg-[var(--color-muted)]" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-[var(--color-muted)]" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
            Article Not Found
          </h1>
          <p className="text-[var(--color-muted-foreground)] mb-8 max-w-md mx-auto">
            {error || 'The article you are looking for does not exist or may have been removed.'}
          </p>
          <Link
            href="/trending-news"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Trending News
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const articleUrl = `${BASE_URL}/trending-news/${article.slug}`;

  const categoryColors: Record<string, string> = {
    Technology: 'rgba(59,130,246,0.12)',
    AI: 'rgba(168,85,247,0.12)',
    Cybersecurity: 'rgba(239,68,68,0.12)',
  };

  const categoryTextColors: Record<string, string> = {
    Technology: '#3b82f6',
    AI: '#a855f7',
    Cybersecurity: '#ef4444',
  };

  const bgColor = categoryColors[article.category] || 'var(--color-primary-tint)';
  const textColor = categoryTextColors[article.category] || 'var(--color-primary)';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors duration-200 hover:text-[var(--color-primary)]">
            Home
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link href="/trending-news" className="transition-colors duration-200 hover:text-[var(--color-primary)]">
            Trending News
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="truncate text-[var(--color-foreground)] font-medium max-w-[200px]">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: bgColor, color: textColor }}
            >
              {article.category}
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">{article.readTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] leading-tight mb-4 tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted-foreground)] mb-6">
            <span className="font-semibold text-[var(--color-foreground)]">{article.source}</span>
            <time dateTime={article.publishedAt}>{formattedDate}</time>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-[0.98]"
            >
              Read Original
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <ShareButtons title={article.title} url={articleUrl} />
          </div>
        </header>

        {/* Article Image */}
        {article.image && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Article Summary */}
        <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 md:p-8">
          <h2 className="text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
            Summary
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-[var(--color-foreground)]">
            {article.summary}
          </p>
        </div>

        {/* Source CTA */}
        <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
              Read the full article on {article.source}
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              This summary was sourced from {article.source}. Click below to read the complete article.
            </p>
          </div>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
          >
            Go to {article.source}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Share */}
        <div className="mb-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Share this article</p>
          <ShareButtons title={article.title} url={articleUrl} />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6">
              Related in {article.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map(related => {
                const relDate = new Date(related.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <Link
                    key={related.id}
                    href={`/trending-news/${related.slug}`}
                    className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_24px_rgba(239,68,68,0.08)]"
                  >
                    <span
                      className="mb-2 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: categoryColors[related.category] || 'var(--color-primary-tint)',
                        color: categoryTextColors[related.category] || 'var(--color-primary)',
                      }}
                    >
                      {related.category}
                    </span>
                    <h3 className="mb-2 text-sm font-bold leading-snug text-[var(--color-foreground)] transition-colors duration-200 group-hover:text-[var(--color-primary)] line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                      <span className="font-medium">{related.source}</span>
                      <span className="opacity-40">&middot;</span>
                      <time dateTime={related.publishedAt}>{relDate}</time>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="text-center pb-8">
          <Link
            href="/trending-news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to All Trending News
          </Link>
        </div>
      </article>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.summary,
            image: article.image || undefined,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
              '@type': 'Organization',
              name: article.source,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Krynn Tools',
              url: BASE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': articleUrl,
            },
            keywords: article.tags.join(', '),
            articleSection: article.category,
          }),
        }}
      />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.summary} />
      <meta property="og:url" content={articleUrl} />
      <meta property="og:site_name" content="Krynn Tools" />
      {article.image && <meta property="og:image" content={article.image} />}
      <meta property="article:published_time" content={article.publishedAt} />
      <meta property="article:section" content={article.category} />
      {article.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content={article.image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.summary} />
      {article.image && <meta name="twitter:image" content={article.image} />}

      {/* Canonical */}
      <link rel="canonical" href={articleUrl} />
    </div>
  );
}
