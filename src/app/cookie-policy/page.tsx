import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for Krynn Tools. Learn about how we use cookies.",
  alternates: { canonical: "https://www.krynntools.online/cookie-policy" },
};

export default function CookiePolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">Cookie Policy</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p><strong>Last updated:</strong> January 1, 2026</p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Analytics:</strong> Google Analytics cookies to understand how visitors use our site</li>
          <li><strong>Advertising:</strong> Google AdSense cookies to serve relevant advertisements</li>
          <li><strong>Preferences:</strong> Cookies to remember your preferences (e.g., dark mode setting)</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">3. Third-Party Cookies</h2>
        <p>Some cookies are set by third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Analytics (_ga, _gid)</li>
          <li>Google AdSense (various advertising cookies)</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">4. Managing Cookies</h2>
        <p>
          You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">5. GDPR Compliance</h2>
        <p>
          If you are in the European Economic Area (EEA), we obtain your consent before setting non-essential cookies. You can withdraw consent at any time.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">6. Contact</h2>
        <p>
          For questions about our Cookie Policy, contact us at contact@krynntools.online.
        </p>
      </div>
    </div>
  );
}
