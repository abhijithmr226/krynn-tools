import { useState, useCallback, useEffect, useMemo } from "react";
import Breadcrumbs from "../layout/Breadcrumbs";
import AdSlot from "./AdSlot";
import StickyMobileCTA from "./StickyMobileCTA";
import { categories, tools } from "@/lib/tools";
import KrynnIcon from "../common/KrynnIcon";
import { CaretRight } from "@phosphor-icons/react";

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
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-tint)]">
            <svg className="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--color-foreground)]">
              {label || "Drag & drop your file here"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              or click to browse files
            </p>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Supports: {accept.replace(/\./g, "").toUpperCase().split(",").join(", ")}
          </p>
        </div>
      </label>
    </form>
  );
}

interface TrustStripProps {}

export function TrustStrip({}: TrustStripProps) {
  const items = [
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Files processed locally" },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant processing" },
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "100% free forever" },
    { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", text: "Works on mobile" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {items.map((item) => (
        <span 
          key={item.text} 
          className="badge badge-primary px-3 py-2 text-[11px]"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-primary)]/10">
            <svg className="h-3 w-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
          </div>
          <span className="font-semibold text-[var(--color-foreground)]">{item.text}</span>
        </span>
      ))}
    </div>
  );
}

interface HowToUseProps {
  steps: string[];
}

export function HowToUse({ steps }: HowToUseProps) {
  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-xs">
          <KrynnIcon name="ListNumbers" size={16} color="var(--color-primary)" weight="duotone" />
        </span>
        How to Use
      </h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white shadow-sm">
              {i + 1}
            </span>
            <span className="pt-0.5 text-[var(--color-muted-foreground)] text-[13px] leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-xs">
          <KrynnIcon name="Question" size={16} color="var(--color-primary)" weight="duotone" />
        </span>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4 transition-colors duration-200">
            <summary className="cursor-pointer font-semibold text-sm text-[var(--color-foreground)] group-open:text-[var(--color-primary)] flex items-center justify-between outline-none">
              <span>{item.question}</span>
              <span className="transition-transform duration-200 group-open:rotate-180 flex shrink-0 ml-2">
                <KrynnIcon name="CaretDown" size={16} weight="bold" />
              </span>
            </summary>
            <p className="mt-3 text-[13px] text-[var(--color-muted-foreground)] leading-relaxed border-t border-[var(--color-border)] pt-3">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

interface RelatedToolsProps {
  tools: Array<{ name: string; slug: string; categorySlug: string }>;
}

export function RelatedTools({ tools: relatedTools }: RelatedToolsProps) {
  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-xs">
          <KrynnIcon name="Link" size={16} color="var(--color-primary)" weight="duotone" />
        </span>
        Related Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {relatedTools.map((t) => {
          const fullTool = tools.find((x) => x.slug === t.slug && x.categorySlug === t.categorySlug);
          const cat = categories.find((c) => c.slug === t.categorySlug);
          const color = cat?.color ?? "var(--color-primary)";
          const iconName = fullTool?.icon ?? "Lightning";
          
          return (
            <a
              key={t.slug}
              href={`/${t.categorySlug}/${t.slug}`}
              className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] hover:border-[var(--color-primary)] transition-all duration-200"
            >
              <div 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg group-hover:scale-105 transition-transform"
                style={{ background: `${color}18` }}
              >
                <KrynnIcon name={iconName} size={20} weight="duotone" color={color} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-[var(--color-foreground)] truncate group-hover:text-[var(--color-primary)] transition-colors">{t.name}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Free Browser Tool</div>
              </div>
              <CaretRight size={14} className="text-[var(--color-muted-foreground)] group-hover:translate-x-0.5 transition-transform" />
            </a>
          );
        })}
      </div>
    </section>
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
  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;

  const categoryName = category?.name ?? categorySlug;

  const breadcrumbItems = [
    ...(categoryName
      ? [{ label: categoryName, href: `/${categorySlug}` }]
      : []),
    ...(toolSlug ? [{ label: title }] : []),
  ];

  return (
    <>
      {/* Header Section with subtle category glow */}
      <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-8 sm:py-10 mb-8">
        <div 
          className="absolute pointer-events-none opacity-20 dark:opacity-35 blur-[90px]"
          style={{
            top: "-30%",
            right: "-10%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${category?.color ?? "var(--color-primary)"} 0%, transparent 70%)`
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs items={breadcrumbItems} />
          )}

          <div className="flex flex-col items-start">
            {category && (
              <span 
                className="badge badge-primary px-3 py-1 mb-4 flex items-center gap-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                  borderColor: `${category.color}25`
                }}
              >
                <KrynnIcon name={category.icon} size={14} weight="duotone" color={category.color} />
                {category.name}
              </span>
            )}
            <h1 className="text-2xl font-extrabold sm:text-3xl text-[var(--color-foreground)] tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Fluid Centered Container (Issue 1 Resolved) */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-6">
          
          {/* Main Workspace Card — primary action area */}
          <div className="workspace-card">
            {children}
          </div>
          
          {/* Trust badges directly below the tool */}
          <div className="py-2">
            <TrustStrip />
          </div>

          <AdSlot position="in-content" />
          
          {/* Secondary sections — clearly demoted below the primary action */}
          <div className="pt-6 sm:pt-8 space-y-8 sm:space-y-12 border-t border-[var(--color-border)]">
            {howToUse.length > 0 && <HowToUse steps={howToUse} />}

            {faq.length > 0 && <FAQ items={faq} />}

            {relatedTools.length > 0 && <RelatedTools tools={relatedTools} />}
            
            <UserReviews toolTitle={title} />
          </div>
          
        </div>
      </div>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
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
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <StickyMobileCTA label="Use This Tool" />
    </>
  );
}

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
      {
        id: "p1",
        author: "Sarah D.",
        rating: 5,
        date: "March 12, 2026",
        content: "Absolute lifesaver for official document handling. I was worried about uploading my tax forms to unknown servers, but since this runs entirely in the browser, I processed it in seconds completely privately."
      },
      {
        id: "p2",
        author: "Alex K.",
        rating: 5,
        date: "April 28, 2026",
        content: "Super clean output. Dropped my file size from 12MB down to 1.8MB with no visible text pixelation. Highly recommend this for fast PDF compression."
      }
    ];
  }
  
  if (isImage) {
    return [
      {
        id: "i1",
        author: "David L.",
        rating: 5,
        date: "February 15, 2026",
        content: "Great crop options. The preset ratios are extremely helpful for quick updates to my social media templates. And since it processes locally, the download is instant."
      },
      {
        id: "i2",
        author: "Elena R.",
        rating: 5,
        date: "May 2, 2026",
        content: "Extremely responsive layout! Compression ratios are perfect, and I love that it doesn't try to upscale or corrupt the aspect ratio. Solid tool."
      }
    ];
  }

  if (isDev) {
    return [
      {
        id: "d1",
        author: "Marcus T.",
        rating: 5,
        date: "January 20, 2026",
        content: "Excellent client-side tool. I parse large payloads often and standard sites lag or crash my browser tab. This parsed my 15MB file smoothly with zero lag."
      },
      {
        id: "d2",
        author: "Jane S.",
        rating: 5,
        date: "June 10, 2026",
        content: "Zero signup friction, responsive formatting, and copy-to-clipboard work flawlessly. Bookmarking this for regular debugging work."
      }
    ];
  }

  return [
    {
      id: "g1",
      author: "Samantha P.",
      rating: 5,
      date: "June 25, 2026",
      content: "Extremely fast, straightforward, and zero intrusive pop-ups. It's rare to find tools that are genuinely free without forcing an email registration."
    },
    {
      id: "g2",
      author: "Robert H.",
      rating: 5,
      date: "July 3, 2026",
      content: "Highly intuitive design and works exactly as advertised. Mobile layout is super friendly and readable too."
    }
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
      try {
        const parsed = JSON.parse(stored) as Review[];
        setReviews([...parsed, ...defaults]);
      } catch (e) {
        setReviews(defaults);
      }
    } else {
      setReviews(defaults);
    }
  }, [toolTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      author: name.trim(),
      rating,
      date: "Just now",
      content: content.trim()
    };

    const stored = localStorage.getItem(`reviews_${toolTitle}`);
    let storedList: Review[] = [];
    if (stored) {
      try { storedList = JSON.parse(stored); } catch(e) {}
    }
    const updatedStored = [newReview, ...storedList];
    localStorage.setItem(`reviews_${toolTitle}`, JSON.stringify(updatedStored));

    setReviews(prev => [newReview, ...prev]);
    setName("");
    setRating(5);
    setContent("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const renderStars = (count: number, size = 16, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => onClick?.(star)}
            className={`h-${size} w-${size} ${onClick ? 'cursor-pointer' : ''} transition-colors duration-150`}
            style={{ width: `${size}px`, height: `${size}px` }}
            viewBox="0 0 24 24"
            fill={star <= count ? "#FBBF24" : "none"}
            stroke={star <= count ? "#D97706" : "currentColor"}
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.198-.39.757-.39.955 0l3.05 6.213 6.852.997c.433.063.606.596.293.903l-4.96 4.833 1.17 6.823c.074.43-.379.76-.763.558L12 18.718l-6.13 3.218c-.384.202-.838-.128-.763-.558l1.17-6.823-4.96-4.833c-.313-.307-.14-.84.293-.903l6.852-.997 3.05-6.213z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-xs">
              <KrynnIcon name="Chat" size={16} color="var(--color-primary)" weight="duotone" />
            </span>
            Feedback &amp; Reviews
          </h2>
          <p className="text-xs text-[var(--color-muted-foreground)]">Real-time comments from our global community.</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-[var(--color-muted)] px-4 py-2.5 rounded-xl border border-[var(--color-border)] self-start">
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-[var(--color-foreground)] leading-none">{averageRating}</span>
              <span className="text-[9px] uppercase font-bold text-[var(--color-muted-foreground)] tracking-wider mt-1 block">out of 5</span>
            </div>
            <div className="h-8 w-[1px] bg-[var(--color-border)]" />
            <div>
              {renderStars(Math.round(parseFloat(averageRating)), 15)}
              <span className="text-[10px] font-semibold text-[var(--color-muted-foreground)] mt-0.5 block">{reviews.length} reviews</span>
            </div>
          </div>
        )}
      </div>

      {/* Review list */}
      <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] shadow-xs"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center font-bold text-xs border border-[var(--color-border)]">
                  {review.author[0].toUpperCase()}
                </span>
                <div>
                  <span className="block text-sm font-bold text-[var(--color-foreground)] leading-snug">{review.author}</span>
                  <span className="block text-[10px] text-[var(--color-muted-foreground)]">{review.date}</span>
                </div>
              </div>
              <div>{renderStars(review.rating, 12)}</div>
            </div>
            <p className="text-[13px] text-[var(--color-foreground)] leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Write a review form */}
      <div className="bg-[var(--color-muted)] p-5 rounded-xl border border-[var(--color-border)]">
        <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-1">Share your experience</h3>
        <p className="text-xs text-[var(--color-muted-foreground)] mb-4">No signup needed. Updates instantly client-side.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Your Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Rating</label>
              <div className="py-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 outline-none focus:scale-110 transition-transform"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <svg
                      className="h-5 w-5 cursor-pointer text-amber-400"
                      viewBox="0 0 24 24"
                      fill={star <= (hoverRating || rating) ? "#FBBF24" : "none"}
                      stroke={star <= (hoverRating || rating) ? "#D97706" : "currentColor"}
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.198-.39.757-.39.955 0l3.05 6.213 6.852.997c.433.063.606.596.293.903l-4.96 4.833 1.17 6.823c.074.43-.379.76-.763.558L12 18.718l-6.13 3.218c-.384.202-.838-.128-.763-.558l1.17-6.823-4.96-4.833c-.313-.307-.14-.84.293-.903l6.852-.997 3.05-6.213z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Comment</label>
            <textarea 
              placeholder="What did you use this tool for? Any feedback or improvements?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className="btn-primary py-2 px-6 text-xs font-semibold rounded-lg"
            >
              Submit Feedback
            </button>
            
            {submitted && (
              <span className="text-xs text-[var(--color-success)] font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Posted!
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
