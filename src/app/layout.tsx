import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krynntools.online"),
  title: {
    default: "Krynn Tools - 100+ Free Online Tools | PDF, Image, Text, Dev & More",
    template: "%s | Krynn Tools",
  },
  description: "100+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security. Fast, private, works in your browser. No signup required.",
  keywords: ["free online tools", "pdf tools", "image compressor", "text tools", "developer tools", "online calculator", "no signup tools", "browser tools"],
  authors: [{ name: "Krynn Tools" }],
  creator: "Krynn Tools",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.krynntools.online",
    siteName: "Krynn Tools",
    title: "Krynn Tools - 100+ Free Online Tools",
    description: "100+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security. Fast, private, works in your browser.",
    images: [{ url: "https://www.krynntools.online/logo.png", width: 1200, height: 630, alt: "Krynn Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@krynnlabs",
    creator: "@krynnlabs",
    title: "Krynn Tools - 100+ Free Online Tools",
    description: "100+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security.",
    images: ["https://www.krynntools.online/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "-Ri2sziEStj-k-iY7hDXnC_oH4Xds1GWT26lqsf6bHE",
  },
};

/* ── Critical above-the-fold CSS — inlined to eliminate render-blocking ── */
const CRITICAL_CSS = `
:root{--color-primary:#D50D09;--color-primary-dark:#B00A07;--color-primary-light:#FF3B30;--color-primary-xlight:#FFF0EF;--color-on-primary:#FFFFFF;--color-background:#FFFFFF;--color-foreground:#0F172A;--color-card:#FFFFFF;--color-card-foreground:#0F172A;--color-muted:#FDF5F5;--color-muted-foreground:#374151;--color-border:#EDE0E0;--color-input:#EDE0E0;--color-ring:#D50D09;--color-destructive:#DC2626;--color-success:#059669;--color-warning:#F59E0B;--glass-bg:rgba(255,255,255,0.82);--glass-border:rgba(255,255,255,0.50);--glass-blur:blur(18px);--glass-shadow:0 8px 32px rgba(0,0,0,0.10);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);--shadow-md:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);--shadow-lg:0 10px 30px rgba(0,0,0,0.10),0 4px 8px rgba(0,0,0,0.06);--shadow-red:0 8px 24px rgba(213,13,9,0.28),0 3px 8px rgba(213,13,9,0.18);--radius:0.625rem;--radius-sm:6px;--radius-md:8px;--radius-lg:12px;--radius-xl:16px;--radius-full:9999px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border-color:var(--color-border)}
html{scroll-behavior:smooth;scroll-padding-top:72px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif}
body{background:var(--color-background);color:var(--color-foreground);font-family:var(--font-sans),system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;min-height:100vh;line-height:1.6;overflow-x:hidden}
html,body{max-width:100vw;overflow-x:hidden}
h1,h2,h3,h4,h5,h6{font-family:var(--font-sans),system-ui,sans-serif;font-weight:700;line-height:1.2;color:var(--color-foreground)}
a{text-decoration:none;color:inherit}
.header-glass{background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,0,0,0.07);box-shadow:0 1px 16px rgba(0,0,0,0.05)}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 28px;background:linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary-dark) 100%);color:var(--color-on-primary);border:none;border-radius:var(--radius-md);font-size:.9375rem;font-weight:700;cursor:pointer;min-height:48px;font-family:inherit;box-shadow:var(--shadow-red);letter-spacing:-.01em;white-space:nowrap;text-decoration:none;position:relative;overflow:hidden}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", plusJakarta.variable)}>
      <head>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-H68ZRX13X7" />
        <Script id="gtag-init" dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-H68ZRX13X7');`,
        }} />

        <meta name="theme-color" content="#D50D09" />

        {/* Critical CSS inlined — eliminates render-blocking on first paint */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />

        {/* Preconnect to AdSense domains */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />

        {/* Google AdSense — deferred until after first interaction */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6232926894418612"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)] pb-28 md:pb-0">{children}</main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Krynn Tools",
              url: "https://www.krynntools.online",
              logo: "https://www.krynntools.online/logo.png",
              description: "100+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security.",
              sameAs: [
                "https://www.linkedin.com/in/abhijithmr226",
                "https://www.instagram.com/krynnlabs",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
