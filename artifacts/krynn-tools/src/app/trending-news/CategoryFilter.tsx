import { useMemo } from "react";
import type { NewsArticle } from "./types";

interface CategoryFilterProps {
  articles: NewsArticle[];
  selected: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = ["All", "Technology", "AI", "Cybersecurity"];

export default function CategoryFilter({ articles, selected, onSelect }: CategoryFilterProps) {
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: articles.length };
    for (const article of articles) {
      map[article.category] = (map[article.category] || 0) + 1;
    }
    return map;
  }, [articles]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((category) => {
        const isActive = selected === category;
        const count = counts[category] || 0;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
                : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-foreground)]"
            }`}
          >
            {category}
            <span
              className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
