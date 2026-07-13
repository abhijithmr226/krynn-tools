import Link from "next/link";
import KrynnLogo from "../common/KrynnLogo";
import { categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="footer-band google-anno-skip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2" style={{ color: "var(--color-foreground)" }}>
              <KrynnLogo height={34} />
            </Link>
            <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
              100+ free online tools. PDF, Image, Text, Dev, Design, Calculators &amp; More. Everything runs in your browser.
            </p>
          </div>

          {/* Tool Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">Tools</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about"   className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Contact</Link></li>
              <li><Link href="/blog"    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy"  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Terms of Service</Link></li>
              <li><Link href="/cookie-policy"   className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Cookie Policy</Link></li>
              <li><Link href="/disclaimer"      className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Built by credit */}
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Built by{" "}
              <a
                href="https://linkedin.com/in/abhijithmr226"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Abhijith MR
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/in/abhijithmr226"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-[var(--color-border)]">·</span>
              <a
                href="https://instagram.com/krynnlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
              >
                Instagram @krynnlabs
              </a>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              &copy; {new Date().getFullYear()} Krynn Tools. All rights reserved. All tools are free and process data in your browser.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
