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
  { name: "Remove Background", slug: "image/remove-background", categorySlug: "image", icon: "Eraser" },
  { name: "Resume Builder", slug: "misc/resume-builder", categorySlug: "misc", icon: "FileText" },
];

const FEATURES = [
  { icon: Shield, title: "100% Private", desc: "Your files never leave your device. Zero server uploads, zero data collection, zero worries.", color: "#22c55e" },
  { icon: Lightning, title: "Blazing Fast", desc: "All processing happens in your browser. No queues, no servers — instant results every time.", color: "#ef4444" },
  { icon: Lock, title: "Always Free", desc: "No paywalls, no premium tiers, no hidden limits. Every tool is completely free forever.", color: "#a855f7" },
  { icon: CheckCircle, title: "Easy to Use", desc: "Clean interfaces designed for simplicity. Pick a tool, do your task, get your result.", color: "#3b82f6" },
  { icon: Sparkle, title: "Regular Updates", desc: "We constantly add new tools and improve existing ones based on user feedback.", color: "#f59e0b" },
];

const STATS = [
  { value: "140+", label: "Tools" },
  { value: "500K+", label: "Users" },
  { value: "10M+", label: "Files Processed" },
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
              <div className="animate-fade-up grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 justify-center lg:justify-start mt-7 max-w-md sm:max-w-none mx-auto lg:mx-0" style={{ animationDelay: "160ms" }}>
                {[
                  { Icon: Shield, label: "100% Private", sub: "No uploads" },
                  { Icon: Lightning, label: "Blazing Fast", sub: "Instant results" },
                  { Icon: CheckCircle, label: "Unlimited", sub: "No restrictions" },
                  { Icon: DeviceMobile, label: "Works Offline", sub: "Browser based" },
                ].map(({ Icon, label, sub }) => (
                  <span key={label} className="inline-flex flex-col items-center lg:items-start text-xs font-medium bg-muted/60 border border-border rounded-xl px-4 py-2.5 w-full sm:w-auto sm:min-w-[120px]">
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
                {["Compress PDF", "Remove Background", "JSON Formatter", "Word Counter", "QR Code", "Resume Builder", "Image Upscaler", "OCR Text", "Merge PDF", "Grammar Checker", "AI Essay Writer", "File Converter"].map((label) => (
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
                fetchPriority="high"
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
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="flex md:flex-col items-center md:justify-center gap-4 md:gap-0 p-4 md:p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:scale-[1.01] md:hover:scale-100 transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 md:mx-auto md:mb-4"
                    style={{ background: `${cat.color}15` }}
                  >
                    <KrynnIcon name={cat.icon} size={20} className="md:w-[26px] md:h-[26px]" weight="duotone" color={cat.color} />
                  </div>
                  <div className="flex-1 md:flex-none text-left md:text-center min-w-0">
                    <h3 className="font-bold text-sm md:text-base mb-0.5 md:mb-1.5 truncate group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">{cat.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="badge badge-muted text-[10px] md:text-xs">{count} Tools</span>
                    <CaretRight size={14} className="text-muted-foreground md:hidden" />
                  </div>
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

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 scrollbar-none stagger-children">
            {popularTools.map((tool) => {
              const cat = categories.find((c) => c.slug === tool.categorySlug);
              const color = cat?.color ?? "#ef4444";
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.categorySlug}/${tool.slug}`}
                  className="tool-card animate-on-scroll flex flex-col w-[280px] sm:w-auto flex-shrink-0 snap-start"
                >
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

      {/* ═══════════ TRENDING NOW ═══════════ */}
      <section className="section-spacing">
        <div className="container-app">
          <span className="section-label">TRENDING NOW</span>
          <h2 className="text-center">Most Searched Tools in 2026</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">
            These tools are trending right now. Join thousands using them daily.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "AI Resume Builder", slug: "misc/resume-builder", categorySlug: "misc", icon: "FileText", color: "#8B5CF6", badge: "Trending" },
              { name: "Image Upscaler", slug: "image/image-upscaler", categorySlug: "image", icon: "Maximize2", color: "#3B82F6", badge: "Popular" },
              { name: "PDF Editor", slug: "pdf/edit-pdf", categorySlug: "pdf", icon: "PencilSimple", color: "#EF4444", badge: "New" },
              { name: "OCR Image to Text", slug: "image/ocr-image-to-text", categorySlug: "image", icon: "ScanText", color: "#3B82F6", badge: "Hot" },
              { name: "Remove Background", slug: "image/remove-background", categorySlug: "image", icon: "Eraser", color: "#3B82F6", badge: "Trending" },
              { name: "AI Grammar Checker", slug: "ai-writing/grammar-fixer", categorySlug: "ai-writing", icon: "CheckCircle", color: "#8B5CF6", badge: "Popular" },
              { name: "File Converter", slug: "misc/file-converter", categorySlug: "misc", icon: "ArrowsClockwise", color: "#6366F1", badge: "New" },
              { name: "QR Code Generator", slug: "security/qr-code-generator", categorySlug: "security", icon: "QrCode", color: "#EC4899", badge: "Essential" },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.categorySlug}/${tool.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:scale-[1.02] transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tool.color}18` }}
                >
                  <KrynnIcon name={tool.icon} size={20} weight="duotone" color={tool.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">{tool.name}</div>
                  <span className="badge badge-primary text-[9px] mt-1">{tool.badge}</span>
                </div>
              </Link>
            ))}
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

      {/* ═══════════ SEARCH TERMS ═══════════ */}
      <section className="section-spacing bg-muted">
        <div className="container-app">
          <span className="section-label">WHAT PEOPLE SEARCH FOR</span>
          <h2 className="text-center">Find Any Tool Instantly</h2>
          <p className="text-center text-muted-foreground mt-3 mb-8">
            Our search understands typos and synonyms. Try these popular searches:
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {[
              "compress pdf", "remove background", "pdf to word", "image upscaler",
              "qr code generator", "resume builder", "grammar checker", "word counter",
              "merge pdf", "json formatter", "password generator", "ocr online",
              "convert image", "ai essay writer", "file converter", "bmi calculator",
              "text case converter", "base64 encoder", "unit converter", "heic to jpg",
            ].map((term) => (
              <button
                key={term}
                onClick={() => { setQuery(term); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
              >
                {term}
              </button>
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
          <Link
            href={`/${categories[0]?.slug ?? ""}`}
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Lightning size={18} weight="fill" /> Explore All 140+ Tools — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ═══════════ SEO CONTENT ═══════════ */}
      <section className="section-spacing">
        <div className="container-app max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">The Best Free Online Tools in 2026</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4 text-sm">
            <p>
              <strong>Krynn Tools</strong> is the ultimate collection of <strong>free online tools</strong> for students, professionals, and developers. Whether you need to <strong>compress PDF</strong> files, <strong>remove background</strong> from images, <strong>convert files</strong> between formats, or generate <strong>QR codes</strong>, Krynn Tools has you covered — all without signup, watermark, or file size limits.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Free PDF Tools — No Signup Required</h3>
            <p>
              Our <strong>PDF tools</strong> let you <strong>compress PDF</strong>, <strong>merge PDF</strong>, <strong>split PDF</strong>, <strong>convert PDF to Word</strong>, <strong>rotate PDF</strong>, <strong>protect PDF with password</strong>, and <strong>edit PDF</strong> online. Every PDF tool runs entirely in your browser — your files never leave your device. Unlike <strong>Smallpdf</strong>, <strong>iLovePDF</strong>, or <strong>Adobe Acrobat</strong>, Krynn Tools is 100% free with no restrictions.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Image Editing & Conversion Tools</h3>
            <p>
              Need to <strong>compress image</strong> files, <strong>resize image</strong>, <strong>remove background</strong>, or <strong>convert PNG to JPG</strong>? Our image tools handle JPEG, PNG, WebP, HEIC, TIFF, and even PSD files. Use the <strong>image upscaler</strong> to enlarge photos up to 4x without losing quality, or try the <strong>OCR tool</strong> to extract text from images instantly. Perfect alternatives to <strong>Canva</strong> and <strong>Photoshop</strong> for quick edits.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Developer Tools & Code Utilities</h3>
            <p>
              Developers love our <strong>JSON formatter</strong>, <strong>Base64 encoder</strong>, <strong>regex tester</strong>, <strong>UUID generator</strong>, <strong>hash generator</strong>, and <strong>SQL formatter</strong>. Format, validate, and convert code in seconds. All tools work offline in your browser — perfect for <strong>ChatGPT alternative</strong> workflows and quick developer utilities.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">AI Writing Tools & Content Generators</h3>
            <p>
              Supercharge your writing with our <strong>AI essay writer</strong>, <strong>grammar checker</strong>, <strong>blog generator</strong>, <strong>paragraph writer</strong>, and <strong>sentence rewriter</strong>. These tools are free alternatives to <strong>Grammarly</strong>, <strong>QuillBot</strong>, <strong>Jasper AI</strong>, and <strong>Copy.ai</strong>. Generate essays, blog posts, LinkedIn content, and Instagram captions in seconds.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Calculators & Converters</h3>
            <p>
              From <strong>BMI calculator</strong> and <strong>age calculator</strong> to <strong>unit converter</strong> and <strong>currency converter</strong>, our calculator tools help you solve everyday problems instantly. No app download needed — just open your browser and get accurate results in seconds.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Why Krynn Tools is the #1 Free Online Tool Platform</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>100% Private</strong> — All processing happens in your browser. Zero server uploads.</li>
              <li><strong>Blazing Fast</strong> — Instant results with no queues or waiting.</li>
              <li><strong>Always Free</strong> — No paywalls, no premium tiers, no hidden limits.</li>
              <li><strong>140+ Tools</strong> — PDF, Image, Text, Developer, Design, Calculator, Security, AI Writing.</li>
              <li><strong>Works Everywhere</strong> — Desktop, tablet, and mobile. No installation required.</li>
              <li><strong>No Signup</strong> — Use any tool instantly without creating an account.</li>
            </ul>
            <p className="mt-4">
              <strong>Krynn Tools</strong> is the best free alternative to <strong>Smallpdf</strong>, <strong>iLovePDF</strong>, <strong>Canva</strong>, <strong>Adobe Acrobat</strong>, <strong>Grammarly</strong>, <strong>QuillBot</strong>, and <strong>Jasper AI</strong>. Try it now at <strong>krynntools.online</strong> — no signup, no watermark, no limits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
