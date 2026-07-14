import { useState } from "react";
import { Link } from "wouter";
import KrynnIcon from "@/components/KrynnIcon";
import { categories, getToolColor } from "@/lib/tools";

const PAGE_SIZE = 9;

interface CategoryClientProps {
  cat: { slug: string; name: string; description: string; color: string; icon: string };
  catTools: Array<{ slug: string; name: string; description: string; icon: string; categorySlug: string }>;
  currentSlug: string;
}

export default function CategoryClient({ cat, catTools, currentSlug }: CategoryClientProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleTools = catTools.slice(0, visibleCount);
  const hasMore = visibleCount < catTools.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl text-[var(--color-foreground)]">{cat.name}</h1>
        <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">{cat.description}</p>
      </div>

      <div className="centered-flex-grid google-anno-skip">
        {visibleTools.map((tool) => {
          const toolColor = getToolColor(tool.slug, cat.color);
          return (
            <Link
              key={tool.slug}
              href={`/${cat.slug}/${tool.slug}`}
              className="tool-card group centered-flex-item-3"
            >
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: toolColor + "15" }}>
                <KrynnIcon name={tool.icon} size={20} className="sm:hidden" weight="duotone" color={toolColor} />
                <KrynnIcon name={tool.icon} size={24} className="hidden sm:block" weight="duotone" color={toolColor} />
              </div>
              <h3 className="mb-2 font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors duration-200 break-words min-w-0">
                {tool.name}
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] break-words min-w-0">
                {tool.description}
              </p>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="btn-secondary"
          >
            Show More ({catTools.length - visibleCount} remaining)
          </button>
        </div>
      )}

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-center text-[var(--color-foreground)]">
          All Categories
        </h2>
        <div className="centered-flex-grid-4 google-anno-skip">
          {categories.filter(c => c.slug !== currentSlug).map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 hover:border-[var(--color-primary)] transition-colors duration-200 centered-flex-item-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: c.color + "15" }}>
                <KrynnIcon name={c.icon} size={20} weight="duotone" color={c.color} />
              </div>
              <span className="font-semibold text-sm text-[var(--color-foreground)] break-words min-w-0">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
