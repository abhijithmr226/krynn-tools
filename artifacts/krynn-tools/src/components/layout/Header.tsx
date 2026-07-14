import { Link, useLocation } from "wouter";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/lib/theme-provider";
import { categories, searchTools, tools } from "@/lib/tools";
import KrynnIcon from "../common/KrynnIcon";
import KrynnLogo from "../common/KrynnLogo";
import {
  MagnifyingGlass,
  Sun,
  Moon,
  X,
  CaretRight,
  GridFour,
  House,
  Star,
  CaretDown,
  Gear,
} from "@phosphor-icons/react";

const navCategories = [
  { name: "PDF Tools", slug: "pdf" },
  { name: "Image Tools", slug: "image" },
  { name: "Text Tools", slug: "text" },
  { name: "Developer Tools", slug: "dev" },
  { name: "AI Tools", slug: "ai-writing" },
];

export default function Header() {
  const [pathname] = useLocation();
  const { dark, toggle } = useTheme();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const moreCategories = useMemo(
    () => categories.filter((c) => !navCategories.some((n) => n.slug === c.slug)),
    []
  );

  const results = query.length >= 1 ? searchTools(query).slice(0, 8) : [];

  const focusSearch = useCallback(() => {
    setMobileSearchOpen(true);
    setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        focusSearch();
      }
      if (e.key === "Escape") {
        setQuery("");
        setMobileSearchOpen(false);
        setCatOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusSearch]);

  useEffect(() => {
    document.body.style.overflow = catOpen || mobileSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [catOpen, mobileSearchOpen]);

  useEffect(() => {
    setCatOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname]
  );

  const [catQuery, setCatQuery] = useState("");
  const filteredCategories = useMemo(() => {
    if (!catQuery.trim()) return categories;
    const q = catQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [catQuery]);

  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach((t) => {
      counts[t.categorySlug] = (counts[t.categorySlug] || 0) + 1;
    });
    return counts;
  }, []);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* ── Header Bar ── */}
      <header className="header-glass sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <KrynnLogo height={32} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navCategories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setHoveredNav(cat.slug)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href={`/${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {cat.name}
                  <CaretDown
                    size={12}
                    className={`transition-transform ${
                      hoveredNav === cat.slug ? "rotate-180" : ""
                    }`}
                  />
                </Link>
                {hoveredNav === cat.slug && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card shadow-xl z-50 py-2 overflow-hidden">
                    {tools
                      .filter((t) => t.categorySlug === cat.slug)
                      .slice(0, 6)
                      .map((t) => {
                        const catDetails = categories.find((c) => c.slug === cat.slug);
                        const color = catDetails?.color ?? "#ef4444";
                        return (
                          <Link
                            key={t.slug}
                            href={`/${t.categorySlug}/${t.slug}`}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `${color}15` }}
                            >
                              <KrynnIcon
                                name={t.icon}
                                size={14}
                                weight="duotone"
                                color={color}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">
                                {t.name}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}

            {/* More dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                More
                <CaretDown
                  size={12}
                  className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card shadow-xl z-50 py-2 overflow-hidden">
                  {moreCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${c.color}15` }}
                      >
                        <KrynnIcon
                          name={c.icon}
                          size={16}
                          weight="duotone"
                          color={c.color}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {toolCounts[c.slug] || 0} tools
                        </div>
                      </div>
                      <CaretRight
                        size={12}
                        className="text-muted-foreground"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Search */}
          <div
            className={`hidden items-center relative max-w-sm w-full mr-3 ${
              pathname === "/" ? "" : "md:flex"
            }`}
          >
            <MagnifyingGlass
              size={16}
              className="absolute left-3 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
            <kbd className="absolute right-3 text-[10px] font-mono text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-12 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            {results.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card overflow-hidden shadow-xl z-50">
                {results.map((tool) => {
                  const cat = categories.find(
                    (c) => c.slug === tool.categorySlug
                  );
                  const color = cat?.color ?? "#ef4444";
                  return (
                    <Link
                      key={tool.slug}
                      href={`/${tool.categorySlug}/${tool.slug}`}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}18` }}
                      >
                        <KrynnIcon
                          name={tool.icon}
                          size={16}
                          weight="duotone"
                          color={color}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tool.category}
                        </div>
                      </div>
                      <CaretRight
                        size={14}
                        className="text-muted-foreground"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Red Action Button */}
          <Link
            href="/#popular"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex-shrink-0"
            aria-label="Popular tools"
          >
            <Star size={18} weight="fill" />
          </Link>

          {/* Settings Link */}
          <Link
            href="/settings"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            aria-label="Settings"
          >
            <Gear size={20} weight="bold" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            aria-label={
              mounted && dark ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute transition-all duration-200 ${
                  mounted && dark
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-75"
                }`}
              >
                <Sun size={20} weight="bold" />
              </span>
              <span
                className={`absolute transition-all duration-200 ${
                  mounted && !dark
                    ? "opacity-100 rotate-0 scale-100"
                    : mounted
                      ? "opacity-0 -rotate-90 scale-75"
                      : "opacity-100 rotate-0 scale-100"
                }`}
              >
                <Moon size={20} weight="bold" />
              </span>
            </div>
          </button>

          {/* Mobile Search Button */}
          <button
            onClick={focusSearch}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            aria-label="Search tools"
          >
            <MagnifyingGlass size={20} weight="bold" />
          </button>
        </div>
      </header>

      {/* ── Category Drawer ── */}
      {catOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCatOpen(false);
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl shadow-2xl flex flex-col"
            style={{ height: "min(78vh, calc(100dvh - 80px))" }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-5 pt-3 flex-shrink-0">
              <div>
                <span className="text-base font-bold">All Categories</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {categories.length} categories · {tools.length} tools
                </span>
              </div>
              <button
                onClick={() => setCatOpen(false)}
                className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors"
                aria-label="Close"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
            <div className="px-5 pt-4 pb-2 flex-shrink-0">
              <div className="relative">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={catQuery}
                  onChange={(e) => setCatQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-8">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-muted transition-all mb-1 group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cat.color}15` }}
                  >
                    <KrynnIcon
                      name={cat.icon}
                      size={22}
                      weight="duotone"
                      color={cat.color}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{cat.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {cat.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{
                        color: cat.color,
                        background: `${cat.color}12`,
                      }}
                    >
                      {toolCounts[cat.slug] || 0}
                    </span>
                    <CaretRight
                      size={12}
                      className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Search Overlay ── */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[250] bg-background flex flex-col md:hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setQuery("");
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground flex-shrink-0"
              aria-label="Close search"
            >
              <X size={20} weight="bold" />
            </button>
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {results.length > 0 ? (
              results.map((tool) => {
                const cat = categories.find(
                  (c) => c.slug === tool.categorySlug
                );
                const color = cat?.color ?? "#ef4444";
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.categorySlug}/${tool.slug}`}
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-3 py-3 border-b border-border last:border-0 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18` }}
                    >
                      <KrynnIcon
                        name={tool.icon}
                        size={18}
                        weight="duotone"
                        color={color}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tool.category}
                      </div>
                    </div>
                    <CaretRight
                      size={14}
                      className="text-muted-foreground"
                    />
                  </Link>
                );
              })
            ) : query.length > 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <MagnifyingGlass
                  size={32}
                  className="mx-auto mb-3 opacity-30"
                />
                <div className="font-semibold text-sm">
                  No tools found for "{query}"
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                <MagnifyingGlass
                  size={32}
                  className="mx-auto mb-3 opacity-30"
                />
                <div className="font-semibold text-sm">
                  Start typing to search
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden h-16 bg-card/90 backdrop-blur-xl border-t border-border items-center justify-around"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 w-1/5 h-full text-[10px] font-semibold transition-colors"
          style={{
            color: isActive("/")
              ? "var(--color-primary)"
              : "var(--color-muted-foreground)",
          }}
        >
          <House size={20} weight={isActive("/") ? "fill" : "duotone"} />
          Home
        </Link>
        <button
          onClick={() => setCatOpen(true)}
          className="flex flex-col items-center justify-center gap-1 w-1/5 h-full text-[10px] font-semibold transition-colors"
          style={{
            color: catOpen
              ? "var(--color-primary)"
              : "var(--color-muted-foreground)",
          }}
        >
          <GridFour size={20} weight={catOpen ? "fill" : "duotone"} />
          Categories
        </button>
        <button
          onClick={focusSearch}
          className="flex flex-col items-center justify-center gap-1 w-1/5 h-full text-[10px] font-semibold text-muted-foreground transition-colors"
        >
          <MagnifyingGlass size={20} weight="duotone" />
          Search
        </button>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center gap-1 w-1/5 h-full text-[10px] font-semibold transition-colors"
          style={{
            color: isActive("/settings")
              ? "var(--color-primary)"
              : "var(--color-muted-foreground)",
          }}
        >
          <Gear size={20} weight={isActive("/settings") ? "fill" : "duotone"} />
          Settings
        </Link>
        <button
          onClick={toggle}
          className="flex flex-col items-center justify-center gap-1 w-1/5 h-full text-[10px] font-semibold text-muted-foreground transition-colors"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <span
              className={`absolute transition-all duration-200 ${
                mounted && dark
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 rotate-90 scale-75"
              }`}
            >
              <Sun size={20} weight="fill" />
            </span>
            <span
              className={`absolute transition-all duration-200 ${
                mounted && !dark
                  ? "opacity-100 rotate-0 scale-100"
                  : mounted
                    ? "opacity-0 -rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Moon size={20} weight="duotone" />
            </span>
          </div>
          Theme
        </button>
      </nav>
    </>
  );
}
