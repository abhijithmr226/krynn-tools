"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { categories, getPopularTools, searchTools } from "@/lib/tools";
import KrynnIcon from "@/components/KrynnIcon";
import {
  MagnifyingGlass, Star, Lightning, CheckCircle,
  LockSimple, DeviceMobile, CaretRight, X,
} from "@phosphor-icons/react";

/* ── Feature cards data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: "Lightning",
    title: "Instant Results",
    desc: "Processing happens right in your browser — no server uploads, no waiting.",
    color: "#E8100A",
    bg: "var(--color-primary-xlight)",
    darkBg: "#2D1110",
  },
  {
    icon: "Lock",
    title: "100% Private",
    desc: "Your files never leave your device. We never see, store, or share your data.",
    color: "#059669",
    bg: "#F0FDF4",
    darkBg: "#052e16",
  },
  {
    icon: "Money",
    title: "Always Free",
    desc: "100+ tools at zero cost, forever. No paywalls, no plans, no hidden limits.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    darkBg: "#2e1065",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length > 0 ? searchTools(query) : []), [query]);
  const popularTools = getPopularTools(8);

  // ── Cursor glow ────────────────────────────────────────────
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!glowRef.current) return;
    glowRef.current.style.left = `${e.clientX}px`;
    glowRef.current.style.top = `${e.clientY}px`;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // ── Card tilt physics ──────────────────────────────────────
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 24px rgba(232,16,10,0.08), var(--shadow-lg)`;
  }, []);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "";
    card.style.boxShadow = "";
  }, []);

  // ── Intersection Observer for stagger ─────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.animationPlayState = "paused";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ overflowX: "hidden", position: "relative" }}>

      {/* ── Cursor glow (AI-inspired reactive effect) ── */}
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="hero-gradient" style={{ padding: "clamp(56px,8vw,88px) 0 clamp(52px,7vw,80px)" }}>
        {/* Mesh overlay */}
        <div className="hero-mesh" aria-hidden="true" />

        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", textAlign: "center", position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div className="animate-fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: "22px", animationDelay: "0ms" }}>
            <span className="badge badge-primary">
              <Star size={13} weight="fill" />
              100+ Free Tools · No Signup · No Limits
            </span>
          </div>

          {/* H1 */}
          <h1 className="animate-fade-up" style={{
            fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "18px",
            animationDelay: "60ms",
          }}>
            All The Tools You Need,{" "}
            <span style={{
              background: "linear-gradient(135deg, #E8100A 0%, #C20000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              All In One Place.
            </span>
          </h1>

          <p className="animate-fade-up" style={{
            fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
            color: "var(--color-muted-foreground)",
            lineHeight: 1.75,
            maxWidth: "540px",
            margin: "0 auto 36px",
            animationDelay: "120ms",
          }}>
            Krynn Tools provides 100+ free online utilities to simplify your
            work, boost productivity, and save time — all running in your browser.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up" style={{
            display: "flex", flexWrap: "wrap", gap: "12px",
            justifyContent: "center", marginBottom: "36px",
            animationDelay: "180ms",
          }}>
            <Link href={`/${categories[0]?.slug ?? ""}`} className="btn-primary">
              <Lightning size={18} weight="fill" />
              Explore All Tools
            </Link>
            <Link href="#popular" className="btn-secondary">
              <Star size={18} weight="fill" />
              Popular Tools
            </Link>
          </div>

          {/* Hero Search */}
          <div id="hero-search" className="animate-fade-up" style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 10, animationDelay: "240ms" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", color: "var(--color-muted-foreground)" }}>
                <MagnifyingGlass size={16} />
              </span>
              <input
                type="text"
                placeholder="Search 100+ tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 36px 11px 38px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--color-border)",
                  background: "var(--color-muted)",
                  fontSize: "0.9375rem",
                  boxShadow: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  color: "var(--color-foreground)",
                  transition: "all 180ms ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.background = "var(--color-card)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(232,16,10,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.background = "var(--color-muted)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-muted-foreground)", display: "flex", padding: "4px",
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {results.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                borderRadius: "12px", border: "1px solid var(--color-border)",
                background: "var(--color-card)", overflow: "hidden",
                maxHeight: "320px", overflowY: "auto",
                boxShadow: "var(--shadow-xl)", textAlign: "left",
                animation: "fadeUp 0.15s ease both",
              }}>
                {results.slice(0, 8).map((tool, idx) => {
                  const cat = categories.find(c => c.slug === tool.categorySlug);
                  const colour = cat?.color ?? "#E8100A";
                  return (
                    <Link
                      key={tool.slug}
                      href={`/${tool.categorySlug}/${tool.slug}`}
                      onClick={() => setQuery("")}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "11px 14px",
                        borderBottom: idx < Math.min(results.length - 1, 7) ? "1px solid var(--color-border)" : "none",
                        textDecoration: "none", color: "inherit",
                        transition: "background 150ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-muted)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{
                        width: "36px", height: "36px", flexShrink: 0, borderRadius: "9px",
                        background: `${colour}18`, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <KrynnIcon name={tool.icon} size={18} weight="duotone" color={colour} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>{tool.category}</div>
                      </div>
                      <CaretRight size={14} color="var(--color-muted-foreground)" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trust row */}
          <div className="animate-fade-up" style={{
            display: "flex", flexWrap: "wrap", gap: "16px",
            justifyContent: "center", marginTop: "28px",
            fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-muted-foreground)",
            animationDelay: "300ms",
          }}>
            {[
              { Icon: CheckCircle, label: "100% Free" },
              { Icon: LockSimple, label: "No Signup" },
              { Icon: LockSimple, label: "Private & Secure" },
              { Icon: DeviceMobile, label: "Mobile Friendly" },
            ].map(({ Icon, label }) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon size={15} weight="fill" color="var(--color-primary)" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(48px,8vw,80px) 0", background: "var(--color-background)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
          <span className="section-label">Tool Categories</span>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "10px" }}>
            Browse by Category
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", marginBottom: "40px" }}>
            Pick a category and get started instantly.
          </p>

          <div className="tools-grid stagger-children">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className="category-card glow-card animate-card animate-on-scroll" style={{ display: "block" }} onMouseMove={handleCardMouseMove as any} onMouseLeave={handleCardMouseLeave as any}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: `${cat.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  <KrynnIcon name={cat.icon} size={26} weight="duotone" color={cat.color} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: "6px", fontSize: "0.9375rem", textAlign: "center" }}>{cat.name}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-muted-foreground)", textAlign: "center", lineHeight: 1.6 }}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          POPULAR TOOLS
      ══════════════════════════════════════════════ */}
      <section id="popular" style={{ padding: "clamp(48px,8vw,80px) 0", background: "var(--color-muted)", position: "relative" }}>
        {/* Dot grid decorative pattern */}
        <div className="dot-pattern" style={{
          position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none",
        }} aria-hidden="true" />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", position: "relative" }}>
          <span className="section-label">Popular Tools</span>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "10px" }}>
            Most Used Tools
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", marginBottom: "40px" }}>
            Explore our most popular tools, used by thousands every day.
          </p>

          <div className="tools-grid stagger-children">
            {popularTools.map((tool) => {
              const cat = categories.find((c) => c.slug === tool.categorySlug);
              const colour = cat?.color ?? "#E8100A";
              return (
                <Link key={tool.slug} href={`/${tool.categorySlug}/${tool.slug}`} className="tool-card animate-card animate-on-scroll tilt-card" style={{ display: "flex", flexDirection: "column" }} onMouseMove={handleCardMouseMove as any} onMouseLeave={handleCardMouseLeave as any}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px",
                    background: `${colour}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "14px", flexShrink: 0,
                  }}>
                    <KrynnIcon name={tool.icon} size={23} weight="duotone" color={colour} />
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: "7px", fontSize: "0.9375rem" }}>{tool.name}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-muted-foreground)", lineHeight: 1.65, flex: 1, marginBottom: "14px" }}>{tool.description}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    Use Tool <CaretRight size={13} weight="bold" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link href={`/${categories[0]?.slug ?? ""}`} className="btn-primary">
              <Lightning size={18} weight="fill" />
              View All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(48px,8vw,80px) 0", background: "var(--color-background)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
          <span className="section-label">Why Krynn Tools?</span>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "10px" }}>
            Built for Speed &amp; Privacy
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", marginBottom: "48px" }}>
            Every tool is engineered to be fast, private, and completely free.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="animate-card animate-on-scroll" style={{
                borderRadius: "16px", padding: "28px 24px", textAlign: "center",
                background: `${f.color}0d`,
                border: `1px solid ${f.color}22`,
                transition: "transform 240ms ease, box-shadow 240ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}>
                <div style={{
                  width: "58px", height: "58px", borderRadius: "16px",
                  background: `${f.color}18`, display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 18px",
                }}>
                  <KrynnIcon name={f.icon} size={28} weight="duotone" color={f.color} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "9px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section style={{
        padding: "clamp(56px,8vw,80px) clamp(16px,4vw,24px)",
        background: "linear-gradient(135deg, #E8100A 0%, #C20000 100%)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blob in CTA */}
        <div style={{
          position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", top: "-100px", right: "-80px",
          pointerEvents: "none",
          animation: "blob-morph 12s ease-in-out infinite",
        }} aria-hidden="true" />
        <div style={{ maxWidth: "620px", margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "14px" }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, marginBottom: "32px" }}>
            Join thousands of users who rely on Krynn Tools every day. Free, fast, and no account required.
          </p>
          <Link
            href={`/${categories[0]?.slug ?? ""}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px",
              background: "#fff", color: "#E8100A",
              fontWeight: 700, fontSize: "0.9375rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
              textDecoration: "none",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.20)";
            }}
          >
            <Lightning size={18} weight="fill" />
            Explore All Tools — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SEO TEXT
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(40px,6vw,64px) 0", background: "var(--color-muted)" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "18px" }}>Why Krynn Tools?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.8 }}>
            <p>Krynn Tools is a free collection of 100+ online utilities designed to make your everyday tasks easier. Whether you need to compress a PDF, resize an image, format JSON, or calculate your BMI — we have the right tool.</p>
            <p>Every tool runs entirely in your browser. Your files never leave your device, ensuring complete privacy and instant results. No uploads, no waiting, no signups required.</p>
            <p>Built with modern web technologies, Krynn Tools works on any device — desktop, tablet, or mobile. All tools are free to use with no restrictions.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
