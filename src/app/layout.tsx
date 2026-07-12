import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

/* ── Plus Jakarta Sans — loaded via next/font for optimal performance ── */
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", plusJakarta.variable)}>
      <head>
        <meta name="theme-color" content="#E8100A" />
        {/* Preconnect to critical third-party domains to accelerate connection setup */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Lazy load Google AdSense script to remove it from the critical render path */}
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
