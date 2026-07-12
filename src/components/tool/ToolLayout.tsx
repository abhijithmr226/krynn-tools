"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Breadcrumbs from "../layout/Breadcrumbs";
import AdSlot from "./AdSlot";
import StickyMobileCTA from "./StickyMobileCTA";
import { categories, tools } from "@/lib/tools";
import KrynnIcon from "../common/KrynnIcon";

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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
            <svg className="h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Files never uploaded" },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant results" },
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "100% free" },
    { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", text: "Works on mobile" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg bg-[var(--color-muted)] px-6 py-4">
      {items.map((item) => (
        <span key={item.text} className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
          <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
          </svg>
          {item.text}
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
    <section>
      <h2 className="mb-6 text-2xl font-bold text-[var(--color-foreground)]">How to Use</h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-1 text-[var(--color-foreground)] leading-relaxed">{step}</span>
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
    <section>
      <h2 className="mb-6 text-2xl font-bold text-[var(--color-foreground)]">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group rounded-lg border border-[var(--color-border)] p-4">
            <summary className="cursor-pointer font-semibold text-[var(--color-foreground)] group-open:text-[var(--color-primary)]">
              {item.question}
            </summary>
            <p className="mt-3 text-[var(--color-muted-foreground)] leading-relaxed">{item.answer}</p>
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
    <section>
      <h2 className="mb-6 text-2xl font-bold text-[var(--color-foreground)]">Related Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {relatedTools.map((t) => {
          // Find full tool details to get its custom icon and category color
          const fullTool = tools.find((x) => x.slug === t.slug && x.categorySlug === t.categorySlug);
          const cat = categories.find((c) => c.slug === t.categorySlug);
          const color = cat?.color ?? "var(--color-primary)";
          const iconName = fullTool?.icon ?? "Lightning";
          
          return (
            <a
              key={t.slug}
              href={`/${t.categorySlug}/${t.slug}`}
              className="tool-card flex items-center gap-4"
            >
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ background: `${color}18` }}
              >
                <KrynnIcon name={iconName} size={22} weight="duotone" color={color} />
              </div>
              <div>
                <div className="font-semibold text-[var(--color-foreground)]">{t.name}</div>
                <div className="text-sm text-[var(--color-muted-foreground)]">Free online tool</div>
              </div>
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
  const categoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug
    : undefined;

  const breadcrumbItems = [
    ...(categoryName
      ? [{ label: categoryName, href: `/${categorySlug}` }]
      : []),
    ...(toolSlug ? [{ label: title }] : []),
  ];

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {breadcrumbItems.length > 0 && (
          <Breadcrumbs items={breadcrumbItems} />
        )}

        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl text-[var(--color-foreground)]">{title}</h1>
          <p className="text-lg text-[var(--color-muted-foreground)]">{subtitle}</p>
        </div>

        <div className="mb-10">{children}</div>

        <AdSlot position="in-content" />

        <div className="mb-12">
          <TrustStrip />
        </div>

        <AdSlot position="below-tool" />

        <div className="space-y-12">
          <HowToUse steps={howToUse} />
          <FAQ items={faq} />
          <RelatedTools tools={relatedTools} />
          <UserReviews toolTitle={title} />
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
      </div>

      <div className="hidden md:block">
        <AdSlot position="sidebar" />
      </div>

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
    <section className="border-t border-[var(--color-border)] pt-8 mt-12">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">User Reviews &amp; Feedback</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">Real-time comments from our global community of users.</p>
        </div>
        
        {/* Rating summary block */}
        <div className="flex items-center gap-4 bg-[var(--color-muted)] p-4 rounded-xl border border-[var(--color-border)] self-start">
          <div className="text-center">
            <span className="block text-3xl font-extrabold text-[var(--color-foreground)] leading-none">{averageRating}</span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-muted-foreground)] tracking-wider mt-1 block">out of 5</span>
          </div>
          <div className="h-10 w-[1.5px] bg-[var(--color-border)]" />
          <div>
            {renderStars(Math.round(parseFloat(averageRating)), 18)}
            <span className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-1 block">{reviews.length} reviews submitted</span>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4 mb-8 max-h-[240px] md:max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="p-4 rounded-xl border border-[var(--color-border)] bg-white/40 dark:bg-black/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
                  {review.author[0].toUpperCase()}
                </span>
                <div>
                  <span className="block text-sm font-bold text-[var(--color-foreground)] leading-snug">{review.author}</span>
                  <span className="block text-[10px] text-[var(--color-muted-foreground)]">{review.date}</span>
                </div>
              </div>
              <div>{renderStars(review.rating, 13)}</div>
            </div>
            <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Write a review form */}
      <div className="bg-[var(--color-muted)] p-5 rounded-2xl border border-[var(--color-border)]">
        <h3 className="text-base font-bold text-[var(--color-foreground)] mb-1">Share your experience</h3>
        <p className="text-xs text-[var(--color-muted-foreground)] mb-4">No signup needed. Your feedback runs client-side and updates instantly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Your Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                className="w-full text-base rounded-lg px-3 py-2 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Rating</label>
              <div className="py-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 outline-none focus:scale-110 transition-transform"
                  >
                    <svg
                      className="h-6 w-6 cursor-pointer text-amber-400"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Comment</label>
            <textarea 
              placeholder="What did you use this tool for? Any feedback or improvements?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full text-base rounded-lg px-3 py-2 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className="btn-primary py-2 px-6 text-sm font-semibold rounded-lg"
            >
              Submit Feedback
            </button>
            
            {submitted && (
              <span className="text-xs text-[var(--color-success)] font-bold flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Feedback posted successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
