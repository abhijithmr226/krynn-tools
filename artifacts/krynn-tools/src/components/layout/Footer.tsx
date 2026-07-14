import { Link } from "wouter";
import KrynnLogo from "../common/KrynnLogo";
import { categories } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="footer-band pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <div className="container-app py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <KrynnLogo height={30} />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              100+ free online tools. PDF, Image, Text, Dev, Design, Calculators & More. Everything runs in your browser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Contact</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Krynn Tools. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/in/abhijithmr226" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="https://instagram.com/krynnlabs" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
