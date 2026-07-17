import { Link } from "wouter";

const COMPARE_DATA = [
  {
    feature: "Price",
    krynn: "100% Free — always",
    removebg: "Free — 1 credit per image, then paid",
    winner: "krynn",
  },
  {
    feature: "Watermark",
    krynn: "No watermark on free outputs",
    removebg: "Watermark on free downloads (low-res preview)",
    winner: "krynn",
  },
  {
    feature: "Privacy",
    krynn: "Images never leave your device — browser processing",
    removebg: "Images uploaded to remove.bg servers",
    winner: "krynn",
  },
  {
    feature: "File Size Limit",
    krynn: "No limits (browser RAM only)",
    removebg: "Free: standard resolution only",
    winner: "krynn",
  },
  {
    feature: "Batch Processing",
    krynn: "Unlimited — process as many as you want",
    removebg: "Paid plans only for batch",
    winner: "krynn",
  },
  {
    feature: "Output Quality",
    krynn: "Full resolution PNG with transparent background",
    removebg: "High quality (full resolution on paid plan)",
    winner: "removebg",
  },
  {
    feature: "Sign-up Required",
    krynn: "No sign-up ever",
    removebg: "Account needed for more than 1 free image",
    winner: "krynn",
  },
  {
    feature: "Additional Tools",
    krynn: "15+ image tools, 20+ PDF tools, 140+ total",
    removebg: "Background removal only",
    winner: "krynn",
  },
  {
    feature: "Works Offline",
    krynn: "Yes — fully client-side",
    removebg: "No — requires internet",
    winner: "krynn",
  },
  {
    feature: "Mobile Support",
    krynn: "Yes — works in any mobile browser",
    removebg: "Yes — iOS and Android apps",
    winner: "tie",
  },
];

const KRYNN_IMAGE_TOOLS = [
  { name: "Remove Background", href: "/image/remove-background" },
  { name: "Compress PNG", href: "/image/compress-png" },
  { name: "Compress JPG", href: "/image/compress-jpg" },
  { name: "Resize Image", href: "/image/resize-image" },
  { name: "Crop Image", href: "/image/crop-image" },
  { name: "Image to WebP", href: "/image/image-to-webp" },
  { name: "Image Upscaler", href: "/image/image-upscaler" },
  { name: "PNG to JPG", href: "/image/png-to-jpg" },
  { name: "WebP to PNG", href: "/image/webp-to-png" },
  { name: "Convert Image", href: "/image/convert-image" },
];

export default function RemovebgAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-background)] to-[var(--color-muted)]">
        <div className="container-app py-16 text-center max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-foreground)]">Remove.bg Alternative</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-6 border border-[var(--color-primary)]/20">
            No Watermark · No Upload · No Sign-up
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-5 tracking-tight">
            Best Free <span className="text-[var(--color-primary)]">Remove.bg Alternative</span> in 2026 — No Watermark
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
            Remove.bg limits free users to low-resolution watermarked previews. Krynn Tools removes backgrounds from images for free — full resolution, no watermark, no sign-up. AI-powered processing runs entirely in your browser.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/image/remove-background" className="btn-primary px-8 py-3 text-base">
              Try Background Removal Free →
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
              { value: "0", label: "Watermarks" },
              { value: "0", label: "Sign-ups" },
              { value: "140+", label: "Total Tools" },
              { value: "0", label: "Credits Needed" },
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
          Krynn Tools vs Remove.bg — Feature Comparison
        </h2>
        <p className="text-center text-[var(--color-muted-foreground)] mb-10 max-w-2xl mx-auto">
          Honest side-by-side comparison of free background removal tools.
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
                  Remove.bg
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
                  <td className={`px-6 py-4 text-center ${row.winner === "removebg" ? "text-[var(--color-success)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                    {row.winner === "removebg" && <span className="mr-1">✓</span>}{row.removebg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Image Tools grid */}
      <section className="bg-[var(--color-muted)] border-t border-[var(--color-border)]">
        <div className="container-app py-16">
          <h2 className="text-3xl font-bold text-center text-[var(--color-foreground)] mb-3">
            All Image Tools — Free & Private
          </h2>
          <p className="text-center text-[var(--color-muted-foreground)] mb-10">
            Background removal and much more — running entirely in your browser.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {KRYNN_IMAGE_TOOLS.map(tool => (
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
          Why Switch from Remove.bg to Krynn Tools?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "No Watermark, No Catch",
              desc: "Remove.bg watermarks free downloads and limits you to low-resolution previews. Krynn Tools gives you full-resolution, watermark-free results — completely free, no credits needed.",
              icon: "✨",
            },
            {
              title: "Your Photos Stay Private",
              desc: "Remove.bg uploads your images to their servers for processing. Krynn Tools uses AI-powered browser processing — your personal photos, product images, and headshots never leave your device.",
              icon: "🔒",
            },
            {
              title: "No Account, No Credits",
              desc: "Remove.bg requires an account after one free image and uses a credit-based pricing system. Krynn Tools is completely anonymous — open the tool, remove the background, download. Done.",
              icon: "🚫",
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
            Ready to Try the Best Remove.bg Alternative?
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8">
            No sign-up. No watermarks. No credits. Just free background removal that works.
          </p>
          <Link href="/image/remove-background" className="btn-primary px-10 py-4 text-base">
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
            name: "Best Free Remove.bg Alternative 2026 — No Watermark | Krynn Tools",
            description:
              "Remove backgrounds from images free with Krynn Tools. No watermark, no signup, no upload. AI-powered browser-based background removal.",
            url: "https://www.krynntools.online/removebg-alternative",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "Remove.bg Alternative", item: "https://www.krynntools.online/removebg-alternative" },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
