import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import KrynnIcon from "@/components/KrynnIcon";
import { searchTools, categories, tools, getToolColor } from "@/lib/tools";
import { MagnifyingGlass, ArrowRight, X, CaretRight } from "@phosphor-icons/react";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => searchTools(query), [query]);

  useEffect(() => {
    const newParams = new URLSearchParams(location.split("?")[1] || "");
    const urlQuery = newParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [location]);

  useEffect(() => {
    document.title = query
      ? `Search: "${query}" — Krynn Tools`
      : "Search Tools — Krynn Tools";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        query
          ? `Search results for "${query}" — Krynn Tools. Find the free online tool you need.`
          : "Search across 128+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security."
      );
    }
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true });
    }
  }

  return (
    <div className="container-app py-8 sm:py-12 lg:py-16">
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search any tool..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-card border border-border text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setLocation("/search", { replace: true }); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      <div className="text-center mb-12">
        <h1 className="mb-3">
          {query ? `Results for "${query}"` : "Search All Tools"}
        </h1>
        {query && (
          <p className="text-muted-foreground">
            Found {results.length} {results.length === 1 ? "tool" : "tools"} matching your search
          </p>
        )}
        {!query && (
          <p className="text-muted-foreground">
            Type above to find any tool across 10 categories and 128+ tools
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((tool) => {
            const cat = categories.find((c) => c.slug === tool.categorySlug);
            const color = cat?.color ?? "#ef4444";
            return (
              <Link
                key={tool.slug}
                href={`/${tool.categorySlug}/${tool.slug}`}
                className="tool-card flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18` }}
                  >
                    <KrynnIcon name={tool.icon} size={22} weight="duotone" color={color} />
                  </div>
                  {tool.popular && (
                    <span className="badge badge-primary text-xs">Popular</span>
                  )}
                </div>
                <h3 className="font-bold text-sm mb-2">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <span className="use-tool-link">
                    Use Tool <ArrowRight size={13} weight="bold" className="arrow-icon" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlass size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No tools found</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn't find any tools matching "<strong>{query}</strong>".
            Try a different spelling or browse by category below.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {query && results.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Browse by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = tools.filter((t) => t.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:border-primary/30 transition-colors"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  <span className="text-muted-foreground">({count})</span>
                  <CaretRight size={10} className="text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
