import { useState, useMemo } from "react";
import type { NewsArticle } from "./types";

interface TrendingSidebarProps {
  articles: NewsArticle[];
}

const TABS = ["Technology", "AI", "Cybersecurity", "Open Source"];

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => a.category === activeTab)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }, [articles, activeTab]);

  const categoryColors: Record<string, string> = {
    Technology: "#3b82f6",
    AI: "#a855f7",
    Cybersecurity: "#ef4444",
    "Open Source": "#22c55e",
  };

  return (
    <aside className="sticky top-24">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] px-4 pt-4 pb-0">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-foreground)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Trending
          </h3>

          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-t-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {filteredArticles.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--color-muted-foreground)]">
              No articles in this category.
            </div>
          ) : (
            filteredArticles.map((article, index) => {
              const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <a
                  key={article.id}
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-[var(--color-muted)]"
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                    style={{
                      background: `${categoryColors[article.category] || "var(--color-primary)"}15`,
                      color: categoryColors[article.category] || "var(--color-primary)",
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-foreground)]">
                      {article.title}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--color-muted-foreground)]">
                      <span>{article.source}</span>
                      <span className="opacity-40">&middot;</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                </a>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
