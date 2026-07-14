import { useState, memo } from "react";
import type { NewsArticle } from "./types";
import ShareButtons from "./ShareButtons";

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCardInner({ article }: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const categoryColors: Record<string, string> = {
    Technology: "rgba(59,130,246,0.12)",
    AI: "rgba(168,85,247,0.12)",
    Cybersecurity: "rgba(239,68,68,0.12)",
  };

  const categoryTextColors: Record<string, string> = {
    Technology: "#3b82f6",
    AI: "#a855f7",
    Cybersecurity: "#ef4444",
  };

  const bgColor = categoryColors[article.category] || "var(--color-primary-tint)";
  const textColor = categoryTextColors[article.category] || "var(--color-primary)";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_24px_rgba(239,68,68,0.08)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-muted)]">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-primary)]/20" />
              </div>
            )}
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-muted)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]/40">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
            style={{ background: bgColor, color: textColor }}
          >
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-base font-bold leading-snug text-[var(--color-foreground)] transition-colors duration-200 group-hover:text-[var(--color-primary)] line-clamp-2">
          {article.title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-[var(--color-muted-foreground)] line-clamp-3">
          {article.summary}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
          <span className="font-medium text-[var(--color-foreground)]">{article.source}</span>
          <span className="opacity-40">&middot;</span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
          <span className="opacity-40">&middot;</span>
          <span>{article.readTime} min read</span>
        </div>

        {article.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3.5 py-2 text-xs font-semibold text-[var(--color-foreground)] transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
          >
            Read Original
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>

          <ShareButtons title={article.title} url={article.sourceUrl} />
        </div>
      </div>
    </article>
  );
}

const NewsCard = memo(NewsCardInner);
export default NewsCard;
