import { Link } from "wouter";

const COMPARE_DATA = [
  {
    feature: "Price",
    krynn: "100% Free — always",
    smallpdf: "Freemium — 2 free tasks/day, €9/mo for unlimited",
    winner: "krynn",
  },
  {
    feature: "Daily task limit",
    krynn: "Unlimited",
    smallpdf: "2 tasks/day on free plan",
    winner: "krynn",
  },
  {
    feature: "Privacy",
    krynn: "Files never leave your device",
    smallpdf: "Files uploaded to SmallPDF servers, deleted after 1 hour",
    winner: "krynn",
  },
  {
    feature: "Sign-up required",
    krynn: "No sign-up ever",
    smallpdf: "Required for more than 2 tasks/day",
    winner: "krynn",
  },
  {
    feature: "PDF compression quality",
    krynn: "Good — browser-based WASM",
    smallpdf: "Excellent — server-side processing",
    winner: "smallpdf",
  },
  {
    feature: "Number of PDF tools",
    krynn: "20+ PDF tools",
    smallpdf: "20+ PDF tools",
    winner: "tie",
  },
  {
    feature: "Image tools",
    krynn: "15+ image tools",
    smallpdf: "Basic JPG/PNG conversion only",
    winner: "krynn",
  },
  {
    feature: "Works offline",
    krynn: "Yes — fully client-side",
    smallpdf: "No — requires internet",
    winner: "krynn",
  },
  {
    feature: "eSign",
    krynn: "Basic sign PDF tool",
    smallpdf: "Advanced eSign with certificates",
    winner: "smallpdf",
  },
  {
    feature: "AI writing tools",
    krynn: "Yes — essay writer, summariser, grammar fixer",
    smallpdf: "AI PDF chat (premium only)",
    winner: "krynn",
  },
  {
    feature: "Developer tools",
    krynn: "Yes — JSON, Base64, UUID, etc.",
    smallpdf: "No",
    winner: "krynn",
  },
];

const KRYNN_PDF_TOOLS = [
  { name: "Compress PDF", href: "/pdf/compress-pdf" },
  { name: "Merge PDF", href: "/pdf/merge-pdf" },
  { name: "Split PDF", href: "/pdf/split-pdf" },
  { name: "PDF to Word", href: "/pdf/pdf-to-word" },
  { name: "Word to PDF", href: "/pdf/word-to-pdf" },
  { name: "PDF to JPG", href: "/pdf/pdf-to-jpg" },
  { name: "JPG to PDF", href: "/pdf/jpg-to-pdf" },
  { name: "Rotate PDF", href: "/pdf/rotate-pdf" },
  { name: "Unlock PDF", href: "/pdf/unlock-pdf" },
  { name: "Protect PDF", href: "/pdf/protect-pdf" },
];

export default function SmallpdfAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-background)] to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-foreground)]">Smallpdf Alternative</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-6 border border-[var(--color-primary)]/20">
            Unlimited · No Upload · No Sign-up
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-5 tracking-tight">
            Best Free <span className="text-[var(--color-primary)]">Smallpdf Alternative</span> in 2026
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
            Tired of Smallpdf's 2-tasks-per-day limit? Krynn Tools gives you unlimited PDF tools — compress, merge, split, convert, rotate — completely free, with no file uploads and no daily caps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pdf" className="btn-primary px-8 py-3 text-base">
              Try PDF Tools Free →
            </Link>
            <a href="#compare" className="btn-secondary px-8 py-3 text-base">
              See Comparison
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
        <div className="container-app py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "Unlimited", label: "Tasks/Day" },
              { value: "20+", label: "PDF Tools" },
              { value: "$0", label: "Forever" },
              { value: "0", label: "Uploads Required" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-[var(--color-primary)]">{s.value}</div>
                <div className="text-sm text-[var(--color-muted-foreground)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <section id="compare" className="container-app py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-3">
          Krynn Tools vs Smallpdf — Feature Comparison
        </h2>
        <p className="text-center text-[var(--color-muted-foreground)] mb-10 max-w-2xl mx-auto">
          Honest side-by-side comparison to help you pick the right free PDF tool.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 font-bold text-[var(--color-foreground)]">Feature</th>
                <th className="px-6 py-4 font-bold text-[var(--color-primary)] text-center">
                  ✦ Krynn Tools
                </th>
                <th className="px-6 py-4 font-bold text-[var(--color-muted-foreground)] text-center">
                  Smallpdf
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_DATA.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-[var(--color-border)] last:border-0 ${i % 2 === 0 ? "bg-[var(--color-background)]" : "bg-[var(--color-muted)]/40"}`}
                >
                  <td className="px-6 py-4 font-semibold text-[var(--color-foreground)]">{row.feature}</td>
                  <td className={`px-6 py-4 text-center ${row.winner === "krynn" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-foreground)]"}`}>
                    {row.winner === "krynn" && <span className="mr-1">✓</span>}{row.krynn}
                  </td>
                  <td className={`px-6 py-4 text-center ${row.winner === "smallpdf" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                    {row.winner === "smallpdf" && <span className="mr-1">✓</span>}{row.smallpdf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-center text-[var(--color-muted-foreground)] mt-4">
          Prices and features correct as of July 2026. Smallpdf pricing may vary by region.
        </p>
      </section>

      {/* PDF Tools grid */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-3">
            All PDF Tools — Unlimited & Private
          </h2>
          <p className="text-center text-[var(--color-muted-foreground)] mb-10">
            Everything Smallpdf does, with no daily task limit and no file uploads.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {KRYNN_PDF_TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all text-center group"
              >
                <span className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pdf" className="btn-primary px-8 py-3">
              View All PDF Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Why switch */}
      <section className="container-app py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-10">
          Why Switch from Smallpdf to Krynn Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "No Daily Task Limit",
              desc: "Smallpdf's free plan caps you at 2 tasks per day. Krynn Tools has no limit — compress, merge, and split as many PDFs as you need, completely free, every day.",
              icon: "♾️",
            },
            {
              title: "Zero File Uploads",
              desc: "Smallpdf uploads your documents to Swiss servers. Krynn Tools runs entirely in your browser using WebAssembly — your sensitive files never leave your device.",
              icon: "🔒",
            },
            {
              title: "No Account Needed",
              desc: "Smallpdf pushes you toward creating an account. Krynn Tools is completely anonymous — open a tool, use it, done. No email, no password, no tracking.",
              icon: "👤",
            },
          ].map(item => (
            <div key={item.title} className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-[var(--color-foreground)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is Krynn Tools really unlimited?",
                a: "Yes. There are no task limits, file count limits, or daily caps. The only limit is your browser's available RAM, which is typically several GB.",
              },
              {
                q: "Is Krynn Tools as good as Smallpdf for PDF compression?",
                a: "Krynn Tools uses WebAssembly-based PDF compression that works client-side. For most use cases the quality is comparable. Smallpdf's server-side processing may achieve slightly smaller file sizes for image-heavy PDFs.",
              },
              {
                q: "Does Krynn Tools work on mobile?",
                a: "Yes. Krynn Tools is fully responsive and works in any modern mobile browser including Chrome for Android and Safari on iOS.",
              },
              {
                q: "How does Krynn Tools make money without charging users?",
                a: "Krynn Tools is supported by non-intrusive display advertising. There are no paywalls or premium tiers.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-sm text-[var(--color-foreground)] flex items-center justify-between list-none">
                  {q}
                  <span className="text-[var(--color-muted-foreground)] group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-[var(--color-muted-foreground)] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            Switch to Unlimited Free PDF Tools Today
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8">
            No sign-up. No uploads. No daily limits. No credit card.
          </p>
          <Link href="/pdf" className="btn-primary px-10 py-4 text-base">
            Start Using Krynn Tools — It's Free
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Best Free Smallpdf Alternative 2026 — Krynn Tools",
            description:
              "Krynn Tools is the best free Smallpdf alternative with no daily task limits, no file uploads, and no sign-up required. 20+ PDF tools, 140+ total tools.",
            url: "https://www.krynntools.online/smallpdf-alternative",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "Smallpdf Alternative", item: "https://www.krynntools.online/smallpdf-alternative" },
              ],
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is Krynn Tools really unlimited?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes. There are no task limits, file count limits, or daily caps. The only limit is your browser's available RAM." },
                },
                {
                  "@type": "Question",
                  name: "Does Krynn Tools work on mobile?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes. Krynn Tools is fully responsive and works in any modern mobile browser." },
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
