import { Link } from "wouter";

const COMPARE_DATA = [
  {
    feature: "Price",
    krynn: "100% Free — always",
    ilovepdf: "Freemium — 2 tasks/hour free, $4/mo for unlimited",
    winner: "krynn",
  },
  {
    feature: "File size limit",
    krynn: "No limits (browser RAM only)",
    ilovepdf: "Free: 200 MB max per file",
    winner: "krynn",
  },
  {
    feature: "Privacy",
    krynn: "Files never leave your device",
    ilovepdf: "Files uploaded to iLovePDF servers, auto-deleted in 2h",
    winner: "krynn",
  },
  {
    feature: "Sign-up required",
    krynn: "No sign-up ever",
    ilovepdf: "Not required for basic use; required for premium",
    winner: "krynn",
  },
  {
    feature: "Number of PDF tools",
    krynn: "20+ PDF tools",
    ilovepdf: "25+ PDF tools",
    winner: "ilovepdf",
  },
  {
    feature: "Image tools",
    krynn: "15+ image tools included",
    ilovepdf: "Basic image-to-PDF only",
    winner: "krynn",
  },
  {
    feature: "Works offline",
    krynn: "Yes — fully client-side",
    ilovepdf: "No — requires internet",
    winner: "krynn",
  },
  {
    feature: "Mobile app",
    krynn: "PWA-ready, mobile browser",
    ilovepdf: "iOS & Android apps",
    winner: "ilovepdf",
  },
  {
    feature: "AI writing tools",
    krynn: "Yes — essay writer, summariser, grammar fixer",
    ilovepdf: "No",
    winner: "krynn",
  },
  {
    feature: "Developer tools",
    krynn: "Yes — JSON, Base64, UUID, regex, etc.",
    ilovepdf: "No",
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

export default function IlovepdfAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-background)] to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-foreground)]">iLovePDF Alternative</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-6 border border-[var(--color-primary)]/20">
            Free · No Upload · No Sign-up
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-5 tracking-tight">
            Best Free <span className="text-[var(--color-primary)]">iLovePDF Alternative</span> in 2026
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
            Krynn Tools gives you every PDF tool iLovePDF offers — plus 120+ more tools for images, text, AI writing, and development. 100% free, no uploads, no sign-up. Your files never leave your browser.
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
              { value: "20+", label: "PDF Tools" },
              { value: "140+", label: "Total Tools" },
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
          Krynn Tools vs iLovePDF — Feature Comparison
        </h2>
        <p className="text-center text-[var(--color-muted-foreground)] mb-10 max-w-2xl mx-auto">
          Side-by-side comparison of features that matter most when choosing a free PDF tool.
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
                  iLovePDF
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
                  <td className={`px-6 py-4 text-center ${row.winner === "ilovepdf" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                    {row.winner === "ilovepdf" && <span className="mr-1">✓</span>}{row.ilovepdf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PDF Tools grid */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-3">
            All PDF Tools — Free & Private
          </h2>
          <p className="text-center text-[var(--color-muted-foreground)] mb-10">
            Everything iLovePDF does, running entirely in your browser.
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
          Why Switch from iLovePDF to Krynn Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Your Files Stay Private",
              desc: "iLovePDF uploads your documents to their servers. Krynn Tools processes everything locally in your browser — your bank statements, contracts, and CVs never leave your device.",
              icon: "🔒",
            },
            {
              title: "No Rate Limits, Ever",
              desc: "iLovePDF's free plan limits you to 2 tasks per hour. Krynn Tools has zero rate limits — compress 100 PDFs back-to-back, completely free.",
              icon: "⚡",
            },
            {
              title: "120+ Bonus Tools",
              desc: "Beyond PDF, Krynn Tools includes image compressors, AI writing assistants, password generators, JSON formatters, and much more — all free.",
              icon: "🛠️",
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

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            Ready to Try the Best iLovePDF Alternative?
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8">
            No sign-up. No uploads. No limits. Just free tools that work.
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
            name: "Best Free iLovePDF Alternative 2026 — Krynn Tools",
            description:
              "Krynn Tools is the best free iLovePDF alternative. 20+ PDF tools, 140+ total tools, no file uploads, no sign-up, 100% private browser processing.",
            url: "https://www.krynntools.online/ilovepdf-alternative",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "iLovePDF Alternative", item: "https://www.krynntools.online/ilovepdf-alternative" },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
