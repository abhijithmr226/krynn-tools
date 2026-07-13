"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/lib/theme-provider";
import { categories, searchTools, tools } from "@/lib/tools";
import KrynnIcon from "../common/KrynnIcon";
import KrynnLogo from "../common/KrynnLogo";
import {
  MagnifyingGlass, Sun, Moon, X,
  CaretRight,
} from "@phosphor-icons/react";

export default function Header() {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const catInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const results = query.length >= 1 ? searchTools(query).slice(0, 8) : [];

  const focusSearch = useCallback(() => {
    setMobileSearchOpen(true);
    setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
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

  // Lock body scroll when category bottom-sheet or search overlay is open
  useEffect(() => {
    document.body.style.overflow = catOpen || mobileSearchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [catOpen, mobileSearchOpen]);

  useEffect(() => {
    setCatOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
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

  // Focus category search input when open drawer
  useEffect(() => {
    if (catOpen) {
      setTimeout(() => catInputRef.current?.focus(), 300);
    }
  }, [catOpen]);

  return (
    <>
      {/* Header Bar */}
      <header className="header-glass sticky top-0 z-50">
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          gap: "8px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, color: "var(--color-foreground)" }}>
            <KrynnLogo height={34} />
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Mobile Search Button */}
          <button
            onClick={focusSearch}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "44px", height: "44px", borderRadius: "8px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-muted-foreground)",
              transition: "background 200ms, color 200ms",
              flexShrink: 0,
            }}
            aria-label="Search tools"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-muted)";
              e.currentTarget.style.color = "var(--color-foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--color-muted-foreground)";
            }}
          >
            <MagnifyingGlass size={20} weight="bold" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggle}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "44px", height: "44px", borderRadius: "8px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-muted-foreground)",
              transition: "background 200ms, color 200ms",
              flexShrink: 0,
            }}
            aria-label={mounted && dark ? "Switch to light mode" : "Switch to dark mode"}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-muted)";
              e.currentTarget.style.color = "var(--color-foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--color-muted-foreground)";
            }}
          >
            <div style={{ position: "relative", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{
                position: "absolute",
                opacity: mounted && dark ? 1 : 0,
                transform: mounted && dark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.8)",
                transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
              }}>
                <Sun size={20} weight="bold" />
              </span>
              <span style={{
                position: "absolute",
                opacity: mounted && !dark ? 1 : (mounted ? 0 : 1),
                transform: mounted && !dark ? "rotate(0deg) scale(1)" : (mounted ? "rotate(-90deg) scale(0.8)" : "rotate(0deg) scale(1)"),
                transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
              }}>
                <Moon size={20} weight="bold" />
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Category Drawer (slide-up bottom-sheet) */}
      <div
        className="category-drawer-overlay"
        data-open={catOpen}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          pointerEvents: catOpen ? "auto" : "none",
          opacity: catOpen ? 1 : 0,
          transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setCatOpen(false); }}
      >
        <div
          className="category-drawer"
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "78vh",
            background: "var(--color-card)",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            borderTop: "1px solid var(--color-border)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column",
            transform: catOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Bottom sheet pull handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px", flexShrink: 0 }}>
            <div style={{ width: "38px", height: "4px", borderRadius: "2px", background: "var(--color-border)" }} />
          </div>
          {/* Drawer header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 20px 0", flexShrink: 0,
          }}>
            <div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-foreground)", letterSpacing: "-0.01em" }}>All Categories</span>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--color-muted-foreground)", marginTop: "2px" }}>{categories.length} categories · {tools.length} tools</span>
            </div>
            <button
              onClick={() => setCatOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "38px", height: "38px", borderRadius: "10px",
                background: "var(--color-muted)", border: "none", cursor: "pointer",
                color: "var(--color-muted-foreground)", transition: "background 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-muted)")}
              aria-label="Close categories"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Search filter */}
          <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                display: "flex", color: "var(--color-muted-foreground)", pointerEvents: "none",
              }}>
                <MagnifyingGlass size={16} />
              </span>
              <input
                ref={catInputRef}
                type="text"
                placeholder="Search categories…"
                value={catQuery}
                onChange={(e) => setCatQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 12px 11px 38px",
                  borderRadius: "12px",
                  border: "1.5px solid var(--color-border)",
                  background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  fontSize: "0.875rem",
                  color: "var(--color-foreground)",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "border-color 180ms, box-shadow 180ms",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232,16,10,0.14)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {catQuery && (
                <button
                  onClick={() => setCatQuery("")}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "var(--color-muted)", border: "none", cursor: "pointer",
                    color: "var(--color-muted-foreground)", display: "flex",
                    width: "22px", height: "22px", borderRadius: "6px",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={13} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Category list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px 32px" }}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => {
                const count = toolCounts[cat.slug] || 0;
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "14px", borderRadius: "14px",
                      textDecoration: "none", color: "var(--color-foreground)",
                      marginBottom: "4px",
                      transition: "background 150ms, transform 150ms",
                      opacity: catOpen ? 1 : 0,
                      transform: catOpen ? "translateY(0)" : "translateY(16px)",
                      transitionDelay: catOpen ? `${idx * 35}ms` : "0ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-muted)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: `${cat.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <KrynnIcon name={cat.icon} size={22} weight="duotone" color={cat.color} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{cat.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)", marginTop: "2px", lineHeight: 1.4 }}>{cat.description}</div>
                    </div>
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0,
                    }}>
                      <span style={{
                        fontSize: "0.75rem", fontWeight: 700,
                        color: cat.color, background: `${cat.color}12`,
                        padding: "2px 8px", borderRadius: "6px",
                      }}>
                        {count}
                      </span>
                      <CaretRight size={12} color="var(--color-muted-foreground)" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{
                padding: "48px 20px", textAlign: "center",
                color: "var(--color-muted-foreground)",
              }}>
                <MagnifyingGlass size={36} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>No categories found</div>
                <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>Try a different search term</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 250,
            background: "var(--color-background)",
            display: "flex", flexDirection: "column",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-card)",
          }}>
            <button
              onClick={() => { setMobileSearchOpen(false); setQuery(""); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "38px", height: "38px", borderRadius: "8px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-muted-foreground)", flexShrink: 0,
              }}
              aria-label="Close search"
            >
              <X size={20} weight="bold" />
            </button>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{
                position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                display: "flex", color: "var(--color-muted-foreground)", pointerEvents: "none",
              }}>
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--color-border)",
                  background: "var(--color-muted)",
                  fontSize: "0.9375rem",
                  color: "var(--color-foreground)",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-muted-foreground)", display: "flex", padding: "4px",
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px", paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))" }}>
            {results.length > 0 ? results.map((tool, idx) => {
              const cat = categories.find(c => c.slug === tool.categorySlug);
              const colour = cat?.color ?? "#E8100A";
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.categorySlug}/${tool.slug}`}
                  onClick={() => { setMobileSearchOpen(false); setQuery(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px",
                    borderBottom: idx < results.length - 1 ? "1px solid var(--color-border)" : "none",
                    textDecoration: "none", color: "inherit",
                    borderRadius: "10px",
                    transition: "background 120ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{
                    width: "38px", height: "38px", flexShrink: 0, borderRadius: "10px",
                    background: `${colour}18`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <KrynnIcon name={tool.icon} size={18} weight="duotone" color={colour} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{tool.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>{tool.category}</div>
                  </div>
                  <CaretRight size={14} color="var(--color-muted-foreground)" />
                </Link>
              );
            }) : query.length > 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--color-muted-foreground)" }}>
                <MagnifyingGlass size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>No tools found for &quot;{query}&quot;</div>
              </div>
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--color-muted-foreground)" }}>
                <MagnifyingGlass size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Start typing to search tools</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
        style={{
          height: "64px",
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
            textDecoration: "none",
            color: isActive("/") ? "var(--color-primary)" : "var(--color-muted-foreground)",
            fontSize: "0.6875rem", fontWeight: 600,
            transition: "color 200ms",
            width: "25%",
            height: "100%",
          }}
        >
          <KrynnIcon name="House" size={20} weight={isActive("/") ? "fill" : "duotone"} color={isActive("/") ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
          Home
        </Link>
        <button
          onClick={() => setCatOpen(true)}
          style={{
            background: "none", border: "none", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer",
            color: catOpen ? "var(--color-primary)" : "var(--color-muted-foreground)", 
            fontSize: "0.6875rem", fontWeight: 600,
            transition: "color 200ms",
            width: "25%",
            height: "100%",
          }}
        >
          <KrynnIcon name="GridFour" size={20} weight={catOpen ? "fill" : "duotone"} color={catOpen ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
          Categories
        </button>
        <button
          onClick={focusSearch}
          style={{
            background: "none", border: "none", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer",
            color: "var(--color-muted-foreground)", 
            fontSize: "0.6875rem", fontWeight: 600,
            transition: "color 200ms",
            width: "25%",
            height: "100%",
          }}
        >
          <KrynnIcon name="MagnifyingGlass" size={20} weight="duotone" color="var(--color-muted-foreground)" />
          Search
        </button>
        <button
          onClick={toggle}
          style={{
            background: "none", border: "none", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer",
            color: "var(--color-muted-foreground)",
            fontSize: "0.6875rem", fontWeight: 600,
            transition: "color 200ms",
            width: "25%",
            height: "100%",
          }}
        >
          <div style={{ position: "relative", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2px" }}>
            <span style={{
              position: "absolute",
              opacity: mounted && dark ? 1 : 0,
              transform: mounted && dark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.8)",
              transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
            }}>
              <KrynnIcon name="Sun" size={20} weight="fill" color={isActive("/") ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
            </span>
            <span style={{
              position: "absolute",
              opacity: mounted && !dark ? 1 : (mounted ? 0 : 1),
              transform: mounted && !dark ? "rotate(0deg) scale(1)" : (mounted ? "rotate(-90deg) scale(0.8)" : "rotate(0deg) scale(1)"),
              transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
            }}>
              <KrynnIcon name="Moon" size={20} weight="duotone" color={isActive("/") ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
            </span>
          </div>
          Theme
        </button>
      </nav>
    </>
  );
}
