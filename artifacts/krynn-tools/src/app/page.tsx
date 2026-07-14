import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { categories, getPopularTools, searchTools } from "@/lib/tools";
import KrynnIcon from "@/components/KrynnIcon";
import { MagnifyingGlass, Star, Lightning, CheckCircle, Lock, Shield, DeviceMobile, CaretRight, X } from "@phosphor-icons/react";

const FEATURES = [
  { icon: "Lightning", title: "Instant Results", desc: "Processing happens right in your browser — no server uploads, no waiting.", color: "#ef4444" },
  { icon: "Lock", title: "100% Private", desc: "Your files never leave your device. We never see, store, or share your data.", color: "#22c55e" },
  { icon: "Money", title: "Always Free", desc: "100+ tools at zero cost, forever. No paywalls, no plans, no hidden limits.", color: "#a855f7" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length > 0 ? searchTools(query) : []), [query]);
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
    <div className="overflow-x-hidden relative">
      <div ref={glowRef} className="cursor-glow hidden md:block" aria-hidden="true" />

      {/* ═══════════ HERO ═══════════ */}
      <section className="section-spacing" style={{ background: "linear-gradient(180deg, var(--color-background) 0%, var(--color-muted) 100%)" }}>
        <div className="container-app text-center relative z-10 max-w-3xl mx-auto">
          <div className="animate-fade-up flex justify-center mb-5" style={{ animationDelay: "0ms" }}>
            <span className="badge badge-primary">
              <Star size={13} weight="fill" />
              100+ Free Tools · No Signup · No Limits
            </span>
          </div>

          <h1 className="animate-fade-up" style={{ animationDelay: "60ms" }}>
            All The Tools You Need,{" "}
            <span className="text-primary">All In One Place.</span>
          </h1>

          <p className="animate-fade-up text-muted-foreground mt-5 max-w-xl mx-auto" style={{ animationDelay: "120ms" }}>
            Krynn Tools provides 100+ free online utilities to simplify your work, boost productivity, and save time — all running in your browser.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up flex flex-wrap gap-3 justify-center mt-8" style={{ animationDelay: "180ms" }}>
            <a href="#categories" className="btn-primary">
              <Lightning size={18} weight="fill" /> Explore All Tools
            </a>
            <a href="#popular" className="btn-secondary">
              <Star size={18} weight="fill" /> Popular Tools
            </a>
          </div>

          {/* Search */}
          <div className="animate-fade-up relative max-w-lg mx-auto mt-10" style={{ animationDelay: "240ms" }}>
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search 100+ tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-card border border-border text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-lg"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Clear">
                <X size={16} />
              </button>
            )}
            {results.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xl z-50">
                {results.slice(0, 8).map((tool) => {
                  const cat = categories.find(c => c.slug === tool.categorySlug);
                  const color = cat?.color ?? "#ef4444";
                  return (
                    <Link key={tool.slug} href={`/${tool.categorySlug}/${tool.slug}`} onClick={() => setQuery("")} className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
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

          {/* Trust chips */}
          <div className="animate-fade-up flex flex-wrap gap-2 justify-center mt-8" style={{ animationDelay: "300ms" }}>
            {[
              { Icon: CheckCircle, label: "100% Free" },
              { Icon: Lock, label: "No Signup" },
              { Icon: Shield, label: "Private & Secure" },
              { Icon: DeviceMobile, label: "Mobile Friendly" },
            ].map(({ Icon, label }) => (
              <span key={label} className="badge badge-primary flex items-center gap-1.5 text-xs">
                <Icon size={13} weight="fill" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section id="categories" className="section-spacing">
        <div className="container-app">
          <span className="section-label">Tool Categories</span>
          <h2 className="text-center">Browse by Category</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">Pick a category and get started instantly.</p>

          <div className="grid-4 stagger-children">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className="category-card animate-on-scroll text-center">
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${cat.color}15` }}>
                  <KrynnIcon name={cat.icon} size={26} weight="duotone" color={cat.color} />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{cat.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ POPULAR TOOLS ═══════════ */}
      <section id="popular" className="section-spacing bg-muted relative">
        <div className="container-app relative z-10">
          <span className="section-label">Popular Tools</span>
          <h2 className="text-center">Most Used Tools</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">Explore our most popular tools, used by thousands every day.</p>

          <div className="grid-3 stagger-children">
            {popularTools.map((tool) => {
              const cat = categories.find((c) => c.slug === tool.categorySlug);
              const color = cat?.color ?? "#ef4444";
              return (
                <Link key={tool.slug} href={`/${tool.categorySlug}/${tool.slug}`} className="tool-card animate-on-scroll flex flex-col">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                    <KrynnIcon name={tool.icon} size={22} weight="duotone" color={color} />
                  </div>
                  <h3 className="font-bold text-sm mb-2">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{tool.description}</p>
                  <span className="use-tool-link">
                    Use Tool <CaretRight size={13} weight="bold" className="arrow-icon" />
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

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="section-spacing">
        <div className="container-app max-w-4xl">
          <span className="section-label">Why Krynn Tools?</span>
          <h2 className="text-center">Built for Speed & Privacy</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">Every tool is engineered to be fast, private, and completely free.</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-7 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${f.color}15` }}>
                  <KrynnIcon name={f.icon} size={26} weight="duotone" color={f.color} />
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="section-spacing bg-muted">
        <div className="container-app">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "100+", label: "Free Tools" },
              { value: "10M+", label: "Files Processed" },
              { value: "0", label: "Signups Required" },
              { value: "100%", label: "Client-Side" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
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
          <Link href={`/${categories[0]?.slug ?? ""}`} className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <Lightning size={18} weight="fill" /> Explore All Tools — It's Free
          </Link>
        </div>
      </section>

      {/* ═══════════ SEO TEXT ═══════════ */}
      <section className="section-spacing">
        <div className="container-app max-w-4xl">
          <h2 className="text-center mb-10">Why Krynn Tools?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "BracketsCurly", title: "Browser-first processing", text: "Every tool runs entirely in your browser. Your files never leave your device — no uploads, no servers, no waiting." },
              { icon: "ShieldCheck", title: "Complete privacy", text: "We never see, store, or share your data. Compress PDFs, resize images, or format code — all locally, all private." },
              { icon: "Devices", title: "Works everywhere", text: "100+ tools with no paywalls, no account required, on any device — desktop, tablet, or mobile." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <KrynnIcon name={item.icon} size={22} weight="duotone" color="var(--color-muted-foreground)" />
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
