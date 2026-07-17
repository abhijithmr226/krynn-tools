import { useState } from "react";
import { Link } from "wouter";
import KrynnIcon from "@/components/KrynnIcon";
import { categories, getToolColor } from "@/lib/tools";
import { categorySeoData } from "@/lib/category-seo";

const PAGE_SIZE = 9;

interface CategoryClientProps {
  cat: { slug: string; name: string; description: string; color: string; icon: string };
  catTools: Array<{ slug: string; name: string; description: string; icon: string; categorySlug: string }>;
  currentSlug: string;
}

export default function CategoryClient({ cat, catTools, currentSlug }: CategoryClientProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleTools = catTools.slice(0, visibleCount);
  const hasMore = visibleCount < catTools.length;
  const toolCount = catTools.length;

  const seoData = categorySeoData[currentSlug];

  return (
    <div className="container-app py-8 sm:py-12 lg:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3">{cat.name}</h1>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ backgroundColor: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}25` }}
        >
          <KrynnIcon name={cat.icon} size={12} weight="fill" color={cat.color} />
          {toolCount} {toolCount === 1 ? "Tool" : "Tools"}
        </span>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">{cat.description}</p>
      </div>

      <div className="grid-3">
        {visibleTools.map((tool) => {
          const toolColor = getToolColor(tool.slug, cat.color);
          return (
            <Link key={tool.slug} href={`/${cat.slug}/${tool.slug}`} className="tool-card group">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: toolColor + "15" }}>
                <KrynnIcon name={tool.icon} size={24} weight="duotone" color={toolColor} />
              </div>
              <h3 className="mb-2 font-bold group-hover:text-primary transition-colors duration-200 break-words min-w-0">{tool.name}</h3>
              <p className="text-sm text-muted-foreground break-words min-w-0">{tool.description}</p>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-secondary">
            Show More ({catTools.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* ── SEO Explanatory Guide Section ── */}
      {seoData && (
        <div className="mt-20 pt-16 border-t border-border max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">{seoData.guideTitle}</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            {seoData.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">{section.heading}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {seoData.faqs.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {seoData.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border bg-card space-y-2">
                    <h4 className="font-bold text-sm text-foreground">{faq.question}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON-LD Schema */}
          {seoData.faqs.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: seoData.faqs.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer },
                  })),
                }),
              }}
            />
          )}
        </div>
      )}

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-center">All Categories</h2>
        <div className="grid-4">
          {categories.filter(c => c.slug !== currentSlug).map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-muted transition-all duration-200">
              <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.color + "15" }}>
                <KrynnIcon name={c.icon} size={20} weight="duotone" color={c.color} />
              </div>
              <span className="font-semibold text-sm break-words min-w-0">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
