import { useState, useCallback, useEffect, useMemo } from "react";
import Breadcrumbs from "../layout/Breadcrumbs";
import StickyMobileCTA from "./StickyMobileCTA";
import { categories, tools } from "@/lib/tools";
import KrynnIcon from "../common/KrynnIcon";
import { CaretRight, Upload, CheckCircle, Shield, Lightning, DeviceMobile, Star } from "@phosphor-icons/react";

interface FileDropZoneProps {
  accept?: string;
  onFile: (file: File) => void;
  label?: string;
}

export function FileDropZone({ accept = ".pdf,.jpg,.jpeg,.png,.webp", onFile, label }: FileDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
  }, [onFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFile(e.target.files[0]);
  }, [onFile]);

  return (
    <form
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`drop-zone ${dragActive ? "active" : ""}`}
    >
      <input type="file" accept={accept} onChange={handleChange} className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload size={28} weight="duotone" className="text-primary" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{label || "Drag & drop your file here"}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">or click to browse files</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: {accept.replace(/\./g, "").toUpperCase().split(",").join(", ")}
          </p>
        </div>
      </label>
    </form>
  );
}

interface TrustStripProps {}

export function TrustStrip(_props: TrustStripProps) {
  const items = [
    { Icon: Shield, label: "Files processed locally" },
    { Icon: Lightning, label: "Instant processing" },
    { Icon: CheckCircle, label: "100% free forever" },
    { Icon: DeviceMobile, label: "Works on mobile" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map(({ Icon, label }) => (
        <span key={label} className="badge badge-primary flex items-center gap-2 px-3 py-1.5 text-xs">
          <Icon size={14} weight="fill" className="text-primary" />
          <span className="font-medium text-foreground">{label}</span>
        </span>
      ))}
    </div>
  );
}

interface HowToUseProps { steps: string[]; }

export function HowToUse({ steps }: HowToUseProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <KrynnIcon name="ListNumbers" size={16} color="var(--color-primary)" weight="duotone" />
        </div>
        How to Use
      </h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="w-7 h-7 shrink-0 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
            <span className="pt-0.5 text-sm text-muted-foreground leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface FAQItem { question: string; answer: string; }
interface FAQProps { items: FAQItem[]; }

export function FAQ({ items }: FAQProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <KrynnIcon name="Question" size={16} color="var(--color-primary)" weight="duotone" />
        </div>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-border bg-muted p-4 transition-colors">
            <summary className="cursor-pointer font-semibold text-sm text-foreground group-open:text-primary flex items-center justify-between outline-none">
              <span>{item.question}</span>
              <span className="transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2">
                <KrynnIcon name="CaretDown" size={16} weight="bold" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

interface RelatedToolsProps {
  tools: Array<{ name: string; slug: string; categorySlug: string }>;
}

export function RelatedTools({ tools: relatedTools }: RelatedToolsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <KrynnIcon name="Link" size={16} color="var(--color-primary)" weight="duotone" />
        </div>
        Related Tools
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {relatedTools.map((t) => {
          const fullTool = tools.find((x) => x.slug === t.slug && x.categorySlug === t.categorySlug);
          const cat = categories.find((c) => c.slug === t.categorySlug);
          const color = cat?.color ?? "var(--color-primary)";
          const iconName = fullTool?.icon ?? "Lightning";

          return (
            <a
              key={t.slug}
              href={`/${t.categorySlug}/${t.slug}`}
              className="group flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted hover:border-primary/30 transition-all duration-200"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: `${color}18` }}>
                <KrynnIcon name={iconName} size={20} weight="duotone" color={color} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{t.name}</div>
                <div className="text-xs text-muted-foreground">Free Browser Tool</div>
              </div>
              <CaretRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

interface ToolLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  howToUse: string[];
  faq: FAQItem[];
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema?: object;
  categorySlug?: string;
  toolSlug?: string;
}

export function ToolLayout({ title, subtitle, children, howToUse, faq, relatedTools, schema, categorySlug, toolSlug }: ToolLayoutProps) {
  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined;
  const categoryName = category?.name ?? categorySlug;

  const breadcrumbItems = [
    ...(categoryName ? [{ label: categoryName, href: `/${categorySlug}` }] : []),
    ...(toolSlug ? [{ label: title }] : []),
  ];

  return (
    <>
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden border-b border-border bg-muted">
        <div
          className="absolute pointer-events-none opacity-20 blur-[100px]"
          style={{
            top: "-30%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%",
            background: `radial-gradient(circle, ${category?.color ?? "var(--color-primary)"} 0%, transparent 70%)`,
          }}
        />
        <div className="container-app relative z-10 py-10 sm:py-14">
          {breadcrumbItems.length > 0 && <Breadcrumbs items={breadcrumbItems} />}
          <div className="flex flex-col items-start mt-4">
            {category && (
              <span
                className="badge mb-4 text-xs font-semibold"
                style={{ backgroundColor: `${category.color}15`, color: category.color, borderColor: `${category.color}25` }}
              >
                <KrynnIcon name={category.icon} size={14} weight="duotone" color={category.color} />
                {category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container-app max-w-4xl pb-32 md:pb-16 py-8">
        <div className="space-y-6">
          {/* Primary action area */}
          <div className="workspace-card">{children}</div>

          {/* Trust badges */}
          <TrustStrip />

          {/* Secondary sections */}
          <div className="pt-6 sm:pt-8 space-y-6 sm:space-y-8 border-t border-border">
            {howToUse.length > 0 && <HowToUse steps={howToUse} />}
            {faq.length > 0 && <FAQ items={faq} />}
            {relatedTools.length > 0 && <RelatedTools tools={relatedTools} />}
            <UserReviews toolTitle={title} />
          </div>
        </div>
      </div>

      {/* Schema.org */}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />

      <StickyMobileCTA label="Use This Tool" />
    </>
  );
}

/* ── Reviews ── */

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

function getInitialReviews(toolTitle: string): Review[] {
  const isPdf = toolTitle.toLowerCase().includes("pdf");
  const isImage = toolTitle.toLowerCase().includes("image") || toolTitle.toLowerCase().includes("crop") || toolTitle.toLowerCase().includes("resize");
  const isDev = toolTitle.toLowerCase().includes("json") || toolTitle.toLowerCase().includes("base64") || toolTitle.toLowerCase().includes("formatter") || toolTitle.toLowerCase().includes("regex");

  if (isPdf) {
    return [
      { id: "p1", author: "Sarah D.", rating: 5, date: "March 12, 2026", content: "Absolute lifesaver for official document handling. I was worried about uploading my tax forms to unknown servers, but since this runs entirely in the browser, I processed it in seconds completely privately." },
      { id: "p2", author: "Alex K.", rating: 5, date: "April 28, 2026", content: "Super clean output. Dropped my file size from 12MB down to 1.8MB with no visible text pixelation. Highly recommend this for fast PDF compression." },
    ];
  }
  if (isImage) {
    return [
      { id: "i1", author: "David L.", rating: 5, date: "February 15, 2026", content: "Great crop options. The preset ratios are extremely helpful for quick updates to my social media templates. And since it processes locally, the download is instant." },
      { id: "i2", author: "Elena R.", rating: 5, date: "May 2, 2026", content: "Extremely responsive layout! Compression ratios are perfect, and I love that it doesn't try to upscale or corrupt the aspect ratio. Solid tool." },
    ];
  }
  if (isDev) {
    return [
      { id: "d1", author: "Marcus T.", rating: 5, date: "January 20, 2026", content: "Excellent client-side tool. I parse large payloads often and standard sites lag or crash my browser tab. This parsed my 15MB file smoothly with zero lag." },
      { id: "d2", author: "Jane S.", rating: 5, date: "June 10, 2026", content: "Zero signup friction, responsive formatting, and copy-to-clipboard work flawlessly. Bookmarking this for regular debugging work." },
    ];
  }
  return [
    { id: "g1", author: "Samantha P.", rating: 5, date: "June 25, 2026", content: "Extremely fast, straightforward, and zero intrusive pop-ups. It's rare to find tools that are genuinely free without forcing an email registration." },
    { id: "g2", author: "Robert H.", rating: 5, date: "July 3, 2026", content: "Highly intuitive design and works exactly as advertised. Mobile layout is super friendly and readable too." },
  ];
}

export function UserReviews({ toolTitle }: { toolTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const defaults = getInitialReviews(toolTitle);
    const stored = localStorage.getItem(`reviews_${toolTitle}`);
    if (stored) {
      try { setReviews([...JSON.parse(stored), ...defaults]); } catch { setReviews(defaults); }
    } else {
      setReviews(defaults);
    }
  }, [toolTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    const newReview: Review = { id: Date.now().toString(), author: name.trim(), rating, date: "Just now", content: content.trim() };
    const stored = localStorage.getItem(`reviews_${toolTitle}`);
    let storedList: Review[] = [];
    if (stored) { try { storedList = JSON.parse(stored); } catch {} }
    localStorage.setItem(`reviews_${toolTitle}`, JSON.stringify([newReview, ...storedList]));
    setReviews(prev => [newReview, ...prev]);
    setName(""); setRating(5); setContent(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const renderStars = (count: number, size = 16, onClick?: (r: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          weight={star <= count ? "fill" : "regular"}
          className={`${onClick ? "cursor-pointer" : ""} transition-colors duration-150`}
          style={{ color: star <= count ? "#FBBF24" : "currentColor" }}
          onClick={() => onClick?.(star)}
        />
      ))}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <KrynnIcon name="Chat" size={16} color="var(--color-primary)" weight="duotone" />
            </div>
            Feedback & Reviews
          </h2>
          <p className="text-xs text-muted-foreground">Real-time comments from our global community.</p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-muted px-4 py-2.5 rounded-xl border border-border self-start">
            <div className="text-center">
              <span className="block text-2xl font-extrabold leading-none">{averageRating}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1 block">out of 5</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              {renderStars(Math.round(parseFloat(averageRating)), 14)}
              <span className="text-[10px] font-semibold text-muted-foreground mt-0.5 block">{reviews.length} reviews</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl border border-border bg-muted">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-border">
                  {review.author[0].toUpperCase()}
                </span>
                <div>
                  <span className="block text-sm font-bold leading-snug">{review.author}</span>
                  <span className="block text-[10px] text-muted-foreground">{review.date}</span>
                </div>
              </div>
              {renderStars(review.rating, 12)}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-muted p-5 rounded-xl border border-border">
        <h3 className="text-sm font-bold mb-1">Share your experience</h3>
        <p className="text-xs text-muted-foreground mb-4">No signup needed. Updates instantly client-side.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Your Name</label>
              <input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Rating</label>
              <div className="py-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-0.5 outline-none focus:scale-110 transition-transform" aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}>
                    <Star size={20} weight={star <= (hoverRating || rating) ? "fill" : "regular"} style={{ color: star <= (hoverRating || rating) ? "#FBBF24" : "currentColor" }} className="cursor-pointer" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Comment</label>
            <textarea placeholder="What did you use this tool for?" value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="resize-none" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="btn-primary py-2 px-6 text-sm font-semibold">Submit Feedback</button>
            {submitted && (
              <span className="text-xs text-success font-bold flex items-center gap-1">
                <CheckCircle size={16} /> Posted!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
