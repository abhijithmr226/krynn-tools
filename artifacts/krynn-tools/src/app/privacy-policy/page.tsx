
export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">Privacy Policy</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p><strong>Last updated:</strong> January 1, 2026</p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">1. Introduction</h2>
        <p>
          Krynn Tools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the krynntools.online website. This Privacy Policy explains how we collect, use, and protect your information when you use our free online tools.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">2. Client-Side Processing</h2>
        <p>
          Most tools on Krynn Tools process your files entirely within your browser. This means your files never leave your device and are never uploaded to our servers. This is a core feature of our platform designed to protect your privacy.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">3. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Usage data (pages visited, tools used) via Google Analytics</li>
          <li>Device information (browser type, operating system, screen size)</li>
          <li>Cookie data for analytics and advertising purposes</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">4. Google AdSense</h2>
        <p>
          We use Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website and other websites. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Analytics - for website analytics</li>
          <li>Google AdSense - for advertising</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">6. Data Retention</h2>
        <p>
          Since most tools process data locally in your browser, we do not store any files you process with our tools. Analytics data is retained according to Google Analytics&apos;s default retention policies.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Opt out of personalized advertising</li>
          <li>Disable cookies in your browser settings</li>
          <li>Request information about data we collect</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at contact@krynntools.online.
        </p>
      </div>
    </div>
  );
}
