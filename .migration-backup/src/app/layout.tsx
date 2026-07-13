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
:root{--color-primary:#E8100A;--color-primary-hover:#C20000;--color-primary-tint:#FFF0EF;--color-on-primary:#FFFFFF;--color-background:#FAFAFA;--color-surface:#FFFFFF;--color-card:#FFFFFF;--color-foreground:#1A1A1A;--color-card-foreground:#1A1A1A;--color-muted:#F5F5F5;--color-muted-foreground:#5B5B5B;--color-border:#E5E5E5;--color-input:#E5E5E5;--color-ring:#E8100A;--color-destructive:#DC2626;--color-success:#059669;--color-warning:#D97706;--glass-bg:rgba(250,250,250,0.88);--glass-border:rgba(255,255,255,0.60);--glass-blur:blur(20px);--glass-shadow:0 8px 32px rgba(0,0,0,0.07);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);--shadow-md:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);--shadow-lg:0 10px 30px rgba(0,0,0,0.10),0 4px 8px rgba(0,0,0,0.06);--shadow-red:0 6px 20px rgba(232,16,10,0.28),0 2px 8px rgba(232,16,10,0.18);--radius:0.625rem;--radius-full:9999px;--space-1:.25rem;--space-2:.5rem;--space-3:.75rem;--space-4:1rem;--space-6:1.5rem;--space-8:2rem}
.dark{--color-primary:#FF3B30;--color-primary-hover:#E8100A;--color-primary-tint:#2A0A09;--color-on-primary:#FFFFFF;--color-background:#0F0F0F;--color-surface:#1A1A1A;--color-card:#1A1A1A;--color-foreground:#F5F5F5;--color-card-foreground:#F5F5F5;--color-muted:#141414;--color-muted-foreground:#A3A3A3;--color-border:#3A3A3A;--color-input:#3A3A3A;--color-ring:#FF3B30;--color-destructive:#EF4444;--color-success:#10B981;--color-warning:#FBBF24;--glass-bg:rgba(26,26,26,0.92);--glass-border:rgba(255,255,255,0.06);--glass-shadow:0 8px 32px rgba(0,0,0,0.40);--shadow-sm:0 1px 3px rgba(0,0,0,0.30);--shadow-md:0 4px 12px rgba(0,0,0,0.35);--shadow-lg:0 10px 30px rgba(0,0,0,0.40);--shadow-red:0 6px 20px rgba(255,59,48,0.30),0 2px 8px rgba(255,59,48,0.20)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border-color:var(--color-border)}
html{scroll-behavior:smooth;scroll-padding-top:72px;font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif}
body{background:var(--color-background);color:var(--color-foreground);font-family:var(--font-sans),system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;min-height:100vh;line-height:1.6;overflow-x:hidden;overflow-wrap:break-word;word-break:break-word}
html,body{max-width:100vw;overflow-x:hidden}
h1,h2,h3,h4,h5,h6{font-family:var(--font-sans),system-ui,sans-serif;font-weight:700;line-height:1.2;color:var(--color-foreground);text-wrap:balance}
img,video{max-width:100%;height:auto}
a{text-decoration:none;color:inherit}
.header-glass{background:rgba(250,250,250,0.90);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--color-border);box-shadow:0 1px 12px rgba(0,0,0,0.04)}
.dark .header-glass{background:rgba(15,15,15,0.94);border-bottom:1px solid var(--color-border);box-shadow:0 1px 12px rgba(0,0,0,0.28)}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);padding:0 var(--space-6);background:linear-gradient(135deg,#E8100A 0%,#C20000 100%);color:#fff;border:none;border-radius:calc(var(--radius)*0.8);font-size:.9375rem;font-weight:700;cursor:pointer;min-height:44px;font-family:inherit;box-shadow:var(--shadow-red);letter-spacing:-.01em;white-space:nowrap;text-decoration:none;position:relative;overflow:hidden}
`;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8100A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", plusJakarta.variable)}>
      <head>
        {/* Google Analytics — lazy-loaded to avoid blocking first paint */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-H68ZRX13X7" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload" dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-H68ZRX13X7');`,
        }} />


        {/* Prevent dark mode FOUC — runs before paint, before React hydrates */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
        }} />

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
          <main className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">{children}</main>
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
