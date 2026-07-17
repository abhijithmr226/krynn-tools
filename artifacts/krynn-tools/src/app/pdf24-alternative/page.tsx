import { Link } from "wouter";

const COMPARE_DATA = [
  {
    feature: "Price",
    krynn: "100% Free — always",
    pdf24: "Free (desktop software)",
    winner: "tie",
  },
  {
    feature: "Privacy",
    krynn: "Files never leave your device — browser processing",
    pdf24: "Files processed locally on your desktop",
    winner: "tie",
  },
  {
    feature: "No Install Required",
    krynn: "Yes — works in any browser",
    pdf24: "No — requires desktop software installation",
    winner: "krynn",
  },
  {
    feature: "Mobile Support",
    krynn: "Yes — fully responsive, works on any device",
    pdf24: "Limited — desktop-only software",
    winner: "krynn",
  },
  {
    feature: "File Size Limits",
    krynn: "No limits (browser RAM only)",
    pdf24: "Limited by system resources",
    winner: "tie",
  },
  {
    feature: "Number of Tools",
    krynn: "20+ PDF tools + 140+ total tools",
    pdf24: "20+ PDF tools (PDF only)",
    winner: "krynn",
  },
  {
    feature: "Works Offline",
    krynn: "Yes — fully client-side",
    pdf24: "Yes — desktop software",
    winner: "tie",
  },
  {
    feature: "Updates",
    krynn: "Automatic — always up to date",
    pdf24: "Manual updates required",
    winner: "krynn",
  },
  {
    feature: "Cross-platform",
    krynn: "Any OS with a browser",
    pdf24: "Windows only (primary), Linux (limited)",
    winner: "krynn",
  },
  {
    feature: "Image & AI Tools",
    krynn: "15+ image tools, AI writing tools included",
    pdf24: "No — PDF only",
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

export default function Pdf24AlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-background)] to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-foreground)]">PDF24 Alternative</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-6 border border-[var(--color-primary)]/20">
            No Install · No Upload · Browser-Based
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-5 tracking-tight">
            Best Free <span className="text-[var(--color-primary)]">PDF24 Alternative</span> in 2026 — No Software Needed
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
            PDF24 requires you to download and install desktop software. Krynn Tools gives you the same PDF tools — and 140+ more — running entirely in your browser. No downloads, no installation, no maintenance.
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
              { value: "0", label: "Downloads Required" },
              { value: "20+", label: "PDF Tools" },
              { value: "140+", label: "Total Tools" },
              { value: "0", label: "Installation Steps" },
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
          Krynn Tools vs PDF24 — Feature Comparison
        </h2>
        <p className="text-center text-[var(--color-muted-foreground)] mb-10 max-w-2xl mx-auto">
          Side-by-side comparison of browser-based vs desktop PDF tools.
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
                  PDF24
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
                  <td className={`px-6 py-4 text-center ${row.winner === "pdf24" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                    {row.winner === "pdf24" && <span className="mr-1">✓</span>}{row.pdf24}
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
            All PDF Tools — No Software Required
          </h2>
          <p className="text-center text-[var(--color-muted-foreground)] mb-10">
            Everything PDF24 does, running entirely in your browser. Zero downloads.
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
          Why Switch from PDF24 to Krynn Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Zero Installation Required",
              desc: "PDF24 requires you to download and install desktop software. Krynn Tools runs in your browser — open it and start working immediately. No setup wizards, no update prompts, no disk space used.",
              icon: "🌐",
            },
            {
              title: "Works on Every Device",
              desc: "PDF24 is desktop-only software primarily for Windows. Krynn Tools works on any device with a browser — Windows, Mac, Linux, Chromebook, iPhone, Android. Same tools, same experience everywhere.",
              icon: "📱",
            },
            {
              title: "140+ Tools Beyond PDF",
              desc: "PDF24 is a PDF-only tool. Krynn Tools includes image compressors, AI writing assistants, password generators, JSON formatters, calculators, and much more — all free, all in your browser.",
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
            Ready to Ditch Desktop PDF Software?
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8">
            No download. No installation. No updates. Just open your browser and go.
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
            name: "Best Free PDF24 Alternative 2026 — No Software Needed | Krynn Tools",
            description:
              "Krynn Tools is a free PDF24 alternative with 20+ PDF tools. No desktop software needed — runs entirely in your browser. 100% private.",
            url: "https://www.krynntools.online/pdf24-alternative",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "PDF24 Alternative", item: "https://www.krynntools.online/pdf24-alternative" },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
