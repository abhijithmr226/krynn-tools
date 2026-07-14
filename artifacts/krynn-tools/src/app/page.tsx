import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { categories, getPopularTools, searchTools, tools } from "@/lib/tools";
import { useTheme } from "@/lib/theme-provider";
import KrynnIcon from "@/components/KrynnIcon";
import {
  MagnifyingGlass,
  Star,
  Lightning,
  CheckCircle,
  Lock,
  Shield,
  DeviceMobile,
  CaretRight,
  X,
  ArrowRight,
  Sparkle,
  Quotes,
} from "@phosphor-icons/react";

function getToolCountForCategory(slug: string) {
  return tools.filter((t) => t.categorySlug === slug).length;
}

const FLOAT_CARDS = [
  { name: "Compress PDF", slug: "pdf/compress-pdf", categorySlug: "pdf", icon: "FileDown" },
  { name: "Resize Image", slug: "image/resize-image", categorySlug: "image", icon: "Maximize2" },
  { name: "QR Code", slug: "security/qr-code-generator", categorySlug: "security", icon: "QrCode" },
];

const FEATURES = [
  { icon: Shield, title: "100% Private", desc: "Your files never leave your device. Zero server uploads, zero data collection, zero worries.", color: "#22c55e" },
  { icon: Lightning, title: "Blazing Fast", desc: "All processing happens in your browser. No queues, no servers — instant results every time.", color: "#ef4444" },
  { icon: Lock, title: "Always Free", desc: "No paywalls, no premium tiers, no hidden limits. Every tool is completely free forever.", color: "#a855f7" },
  { icon: CheckCircle, title: "Easy to Use", desc: "Clean interfaces designed for simplicity. Pick a tool, do your task, get your result.", color: "#3b82f6" },
  { icon: Sparkle, title: "Regular Updates", desc: "We constantly add new tools and improve existing ones based on user feedback.", color: "#f59e0b" },
];

const STATS = [
  { value: "128+", label: "Tools" },
  { value: "100K+", label: "Users" },
  { value: "5M+", label: "Files Processed" },
  { value: "0", label: "Signups Required" },
];

export default function HomePage() {
  const { dark } = useTheme();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.length > 0 ? searchTools(query) : []),
    [query]
  );

  const popularTools = getPopularTools(8);

  const glowRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!glowRef.current) return;
    glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const first = results[0];
        window.location.href = `/${first.categorySlug}/${first.slug}`;
      }
    },
    [results]
  );

  return (
    <div className="overflow-x-hidden relative">
      <div ref={glowRef} className="cursor-glow hidden md:block" aria-hidden="true" />

      {/* ═══════════ HERO ═══════════ */}
      <section
        className="section-spacing relative"
        style={{ background: dark ? "#000000" : "#ffffff" }}
      >
        <div className="container-app relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left column 55% */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none text-center lg:text-left">
              <div className="animate-fade-up flex justify-center lg:justify-start mb-5" style={{ animationDelay: "0ms" }}>
                <span className="badge badge-primary uppercase tracking-wider text-xs font-semibold">
                  <Star size={13} weight="fill" />
                  128+ Free Online Tools
                </span>
              </div>

              <h1 className="animate-fade-up text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight" style={{ animationDelay: "60ms" }}>
                All-in-One <br className="hidden sm:block" />
                Online Tools. <br />
                <span className="text-primary">Fast. Private. Free.</span>
              </h1>

              <p className="animate-fade-up text-muted-foreground mt-5 max-w-xl mx-auto lg:mx-0 text-base md:text-lg leading-relaxed" style={{ animationDelay: "120ms" }}>
                Complete collection of productivity, conversion, development, and AI tools. Everything works in your browser.
              </p>

              {/* Trust badges */}
              <div className="animate-fade-up flex flex-wrap gap-3 justify-center lg:justify-start mt-7" style={{ animationDelay: "160ms" }}>
                {[
                  { Icon: Shield, label: "100% Private", sub: "No uploads" },
                  { Icon: Lightning, label: "Blazing Fast", sub: "Instant results" },
                  { Icon: CheckCircle, label: "Unlimited", sub: "No restrictions" },
                  { Icon: DeviceMobile, label: "Works Offline", sub: "Browser based" },
                ].map(({ Icon, label, sub }) => (
                  <span key={label} className="inline-flex flex-col items-center lg:items-start text-xs font-medium bg-muted/60 border border-border rounded-xl px-4 py-2.5 min-w-[120px]">
                    <span className="flex items-center gap-1.5 font-bold text-foreground">
                      <Icon size={14} weight="fill" className="text-primary" /> {label}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{sub}</span>
                  </span>
                ))}
              </div>

              {/* Search bar */}
              <div className="animate-fade-up relative max-w-lg mx-auto lg:mx-0 mt-8 z-30" style={{ animationDelay: "220ms" }} ref={searchRef}>
                <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search any tool..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-28 py-4 rounded-2xl bg-card border border-border text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-xl"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear"
                  >
                    <X size={18} />
                  </button>
                )}
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground pointer-events-none">
                  Ctrl + K
                </kbd>
                {results.length > 0 && (
                  <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xl z-50">
                    {results.slice(0, 8).map((tool) => {
                      const cat = categories.find((c) => c.slug === tool.categorySlug);
                      const color = cat?.color ?? "#ef4444";
                      return (
                        <Link
                          key={tool.slug}
                          href={`/${tool.categorySlug}/${tool.slug}`}
                          onClick={() => setQuery("")}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}18` }}
                          >
                            <KrynnIcon name={tool.icon} size={18} weight="duotone" color={color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.category}</div>
                          </div>
                          <CaretRight size={14} className="text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Popular shortcuts */}
              <div className="animate-fade-up flex flex-wrap gap-2 justify-center lg:justify-start mt-4" style={{ animationDelay: "280ms" }}>
                <span className="text-xs text-muted-foreground mr-1">Popular searches:</span>
                {["Compress PDF", "Remove Background", "JSON Formatter", "Word Counter", "QR Code"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setQuery(label)}
                    className="text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right column 45% — High-Fidelity Hero Graphic */}
            <div className="flex-1 w-full lg:max-w-none flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
              <img
                src={dark ? "/images/hero_dark.webp" : "/images/hero_light.webp"}
                alt="Krynn Tools Platform Overview"
                width={998}
                height={544}
                className="w-[110%] sm:w-[100%] max-w-none lg:max-w-none lg:w-[130%] object-cover lg:object-contain object-right h-full max-h-[480px] select-none pointer-events-none transition-opacity duration-300 lg:-ml-24 xl:-ml-36"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section id="categories" className="section-spacing">
        <div className="container-app">
          <span className="section-label">CATEGORIES</span>
          <h2 className="text-center">Browse by Category</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">
            Pick a category and get started instantly.
          </p>

          <div className="grid-4 stagger-children">
            {categories.map((cat) => {
              const count = getToolCountForCategory(cat.slug);
              return (
                <Link key={cat.slug} href={`/${cat.slug}`} className="category-card animate-on-scroll text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${cat.color}15` }}
                  >
                    <KrynnIcon name={cat.icon} size={26} weight="duotone" color={cat.color} />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cat.description}</p>
                  <span className="badge badge-muted text-xs">{count} Tools</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ POPULAR TOOLS ═══════════ */}
      <section id="popular" className="section-spacing bg-muted relative">
        <div className="container-app relative z-10">
          <span className="section-label">POPULAR TOOLS</span>
          <h2 className="text-center">Most Used Tools</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">
            Explore our most popular tools, used by thousands every day.
          </p>

          <div className="grid-3 stagger-children">
            {popularTools.map((tool) => {
              const cat = categories.find((c) => c.slug === tool.categorySlug);
              const color = cat?.color ?? "#ef4444";
              return (
                <Link key={tool.slug} href={`/${tool.categorySlug}/${tool.slug}`} className="tool-card animate-on-scroll flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}18` }}
                    >
                      <KrynnIcon name={tool.icon} size={22} weight="duotone" color={color} />
                    </div>
                    {tool.popular && (
                      <span className="badge badge-primary text-xs">
                        <Star size={11} weight="fill" /> Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-2">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{tool.description}</p>
                  <span className="use-tool-link">
                    Use Tool <ArrowRight size={13} weight="bold" className="arrow-icon" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a href="#categories" className="btn-primary">
              <Lightning size={18} weight="fill" /> View All Tools
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="section-spacing bg-muted relative overflow-hidden">
        <div className="container-app">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE ═══════════ */}
      <section className="section-spacing">
        <div className="container-app">
          <span className="section-label">WHY KRYNN TOOLS</span>
          <h2 className="text-center">Built for Speed & Privacy</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12 max-w-2xl mx-auto">
            Every tool is engineered to be fast, private, and completely free.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center p-7 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: `${f.color}15` }}
                  >
                    <Icon size={26} weight="duotone" color={f.color} />
                  </div>
                  <h3 className="font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIAL ═══════════ */}
      <section className="section-spacing bg-muted">
        <div className="container-app max-w-3xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center relative">
            <Quotes
              size={48}
              weight="fill"
              className="text-primary/15 mx-auto mb-4"
            />
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} weight="fill" className="text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-foreground mb-8">
              &ldquo;Krynn Tools is my go-to for quick file conversions. No signup, no hassle — it just works.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                AK
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Alex K.</div>
                <div className="text-xs text-muted-foreground">Web Developer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="band-brand section-spacing relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 -top-24 -right-24 pointer-events-none" aria-hidden="true" />
        <div className="container-app relative text-center max-w-2xl mx-auto">
          <h2 className="text-white">Ready to Get Started?</h2>
          <p className="text-white/80 mt-4 mb-10 text-base leading-relaxed">
            Join thousands of users who rely on Krynn Tools every day. Free, fast, and no account required.
          </p>
          <Link
            href={`/${categories[0]?.slug ?? ""}`}
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Lightning size={18} weight="fill" /> Explore All Tools — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
