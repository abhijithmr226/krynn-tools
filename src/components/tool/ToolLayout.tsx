"use client";

import { useState, useCallback } from "react";
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
