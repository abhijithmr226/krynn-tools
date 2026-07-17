import { Link } from "wouter";

const COMPARE_DATA = [
  {
    feature: "Price",
    krynn: "100% Free — always",
    tinypng: "Freemium — 500 compressions/month free, $25/year for API",
    winner: "krynn",
  },
  {
    feature: "Monthly compression limit",
    krynn: "Unlimited",
    tinypng: "500 images/month free; paid for more",
    winner: "krynn",
  },
  {
    feature: "Privacy",
    krynn: "Files never leave your device",
    tinypng: "Images uploaded to TinyPNG servers (auto-deleted after 1h)",
    winner: "krynn",
  },
  {
    feature: "Sign-up required",
    krynn: "No sign-up ever",
    tinypng: "Required for API; optional for web",
    winner: "krynn",
  },
  {
    feature: "Image formats",
    krynn: "PNG, JPG, WebP, AVIF, GIF, BMP, TIFF",
    tinypng: "PNG, JPG, WebP",
    winner: "krynn",
  },
  {
    feature: "Compression quality",
    krynn: "Good — adjustable quality slider",
    tinypng: "Excellent — proprietary lossy algorithm",
    winner: "tinypng",
  },
  {
    feature: "Batch compression",
    krynn: "Yes — unlimited files at once",
    tinypng: "Yes — up to 20 files per session (web)",
    winner: "krynn",
  },
  {
    feature: "Works offline",
    krynn: "Yes — fully client-side WebAssembly",
    tinypng: "No — requires internet",
    winner: "krynn",
  },
  {
    feature: "PDF compression",
    krynn: "Yes — separate PDF compressor tool",
    tinypng: "No",
    winner: "krynn",
  },
  {
    feature: "Image background removal",
    krynn: "Yes — free background remover included",
    tinypng: "No",
    winner: "krynn",
  },
  {
    feature: "Image resizing",
    krynn: "Yes — custom dimensions, presets",
    tinypng: "Yes — basic resize on API",
    winner: "tie",
  },
  {
    feature: "API access",
    krynn: "No public API",
    tinypng: "Yes — $25/year",
    winner: "tinypng",
  },
];

const IMAGE_TOOLS = [
  { name: "Compress Image", href: "/image/compress-image" },
  { name: "Remove Background", href: "/image/remove-background" },
  { name: "Image Resizer", href: "/image/image-resizer" },
  { name: "Image Upscaler", href: "/image/image-upscaler" },
  { name: "Crop Image", href: "/image/crop-image" },
  { name: "Convert PNG to JPG", href: "/image/png-to-jpg" },
  { name: "Convert JPG to PNG", href: "/image/jpg-to-png" },
  { name: "Convert to WebP", href: "/image/convert-to-webp" },
  { name: "HEIC to JPG", href: "/image/heic-to-jpg" },
  { name: "Social Media Resizer", href: "/image/social-media-image-resizer" },
];

export default function TinypngAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-background)] to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-foreground)]">TinyPNG Alternative</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-6 border border-[var(--color-primary)]/20">
            Unlimited · No Upload · No Sign-up
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-5 tracking-tight">
            Best Free <span className="text-[var(--color-primary)]">TinyPNG Alternative</span> in 2026
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
            Hit TinyPNG's 500-image monthly limit? Krynn Tools gives you unlimited image compression — PNG, JPG, WebP, AVIF — completely free, with no uploads and no monthly caps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/image/compress-image" className="btn-primary px-8 py-3 text-base">
              Compress Images Free →
            </Link>
            <a href="#compare" className="btn-secondary px-8 py-3 text-base">
              See Comparison
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
        <div className="container-app py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "Unlimited", label: "Images/Month" },
              { value: "7+", label: "Image Formats" },
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
          Krynn Tools vs TinyPNG — Feature Comparison
        </h2>
        <p className="text-center text-[var(--color-muted-foreground)] mb-10 max-w-2xl mx-auto">
          An honest comparison of free image compression tools in 2026.
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
                  TinyPNG
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
                  <td className={`px-6 py-4 text-center ${row.winner === "tinypng" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                    {row.winner === "tinypng" && <span className="mr-1">✓</span>}{row.tinypng}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-center text-[var(--color-muted-foreground)] mt-4">
          Features correct as of July 2026. TinyPNG pricing may change.
        </p>
      </section>

      {/* Image Tools grid */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-3">
            All Image Tools — Unlimited & Private
          </h2>
          <p className="text-center text-[var(--color-muted-foreground)] mb-10">
            Everything TinyPNG does, plus background removal, upscaling, format conversion, and more.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {IMAGE_TOOLS.map(tool => (
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
            <Link href="/image" className="btn-primary px-8 py-3">
              View All Image Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Why switch */}
      <section className="container-app py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-10">
          Why Switch from TinyPNG to Krynn Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "No Monthly Limits",
              desc: "TinyPNG caps free users at 500 images/month. Krynn Tools has zero limits — compress 5,000 images in a day if you need to. It's always free, always unlimited.",
              icon: "♾️",
            },
            {
              title: "Files Stay on Your Device",
              desc: "TinyPNG uploads your images to their servers before compressing. Krynn Tools processes everything locally using WebAssembly — your images never leave your browser.",
              icon: "🔒",
            },
            {
              title: "More Than Just Compression",
              desc: "After compressing, you can resize, crop, remove backgrounds, upscale to 4x, or convert to WebP — all free, all client-side. TinyPNG only does compression.",
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

      {/* FAQ */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is Krynn Tools image compression as good as TinyPNG?",
                a: "TinyPNG uses a proprietary lossy compression algorithm that achieves very small file sizes for PNGs. Krynn Tools uses browser-based WebAssembly compression which is excellent for most use cases — you can also adjust the quality slider to control the size/quality tradeoff.",
              },
              {
                q: "Can I compress PNG files for free without a limit?",
                a: "Yes. Krynn Tools has no monthly limit. You can compress as many PNG, JPG, or WebP images as you need, completely free, with no sign-up.",
              },
              {
                q: "Does Krynn Tools support batch image compression?",
                a: "Yes. You can drop multiple images at once and compress them all in a single session.",
              },
              {
                q: "What image formats does Krynn Tools support?",
                a: "Krynn Tools supports PNG, JPG/JPEG, WebP, AVIF, GIF, BMP, TIFF, and HEIC (on supported browsers).",
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
            Compress Unlimited Images — Free, Forever
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8">
            No monthly limit. No uploads. No sign-up. No credit card.
          </p>
          <Link href="/image/compress-image" className="btn-primary px-10 py-4 text-base">
            Start Compressing Images — It's Free
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
            name: "Best Free TinyPNG Alternative 2026 — Unlimited Image Compression | Krynn Tools",
            description:
              "Krynn Tools is the best free TinyPNG alternative with unlimited image compression, no monthly limits, no uploads, and no sign-up. Supports PNG, JPG, WebP, AVIF, GIF.",
            url: "https://www.krynntools.online/tinypng-alternative",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "TinyPNG Alternative", item: "https://www.krynntools.online/tinypng-alternative" },
              ],
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Can I compress PNG files for free without a limit?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes. Krynn Tools has no monthly limit. You can compress as many PNG, JPG, or WebP images as you need, completely free, with no sign-up." },
                },
                {
                  "@type": "Question",
                  name: "What image formats does Krynn Tools support?",
                  acceptedAnswer: { "@type": "Answer", text: "PNG, JPG/JPEG, WebP, AVIF, GIF, BMP, TIFF, and HEIC on supported browsers." },
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
