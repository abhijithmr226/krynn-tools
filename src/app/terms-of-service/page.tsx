import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Krynn Tools. Read our terms and conditions.",
  alternates: { canonical: "https://www.krynntools.online/terms-of-service" },
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">Terms of Service</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p><strong>Last updated:</strong> January 1, 2026</p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Krynn Tools (krynntools.online), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">2. Use of Tools</h2>
        <p>
          All tools on Krynn Tools are provided free of charge for personal and commercial use. You may use our tools for any lawful purpose. You are responsible for ensuring that your use of our tools complies with applicable laws.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">3. File Processing</h2>
        <p>
          Most tools process files entirely in your browser. We do not store, access, or share any files you process with our tools. You are solely responsible for the files you upload and process.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">4. Intellectual Property</h2>
        <p>
          The website design, code, and content (excluding user-uploaded files) are owned by Krynn Tools. You may not copy, modify, or distribute our content without written permission.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">5. Disclaimer of Warranties</h2>
        <p>
          Our tools are provided &quot;as is&quot; without warranties of any kind. We do not guarantee that our tools will always be available, error-free, or meet your specific requirements.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">6. Limitation of Liability</h2>
        <p>
          Krynn Tools shall not be liable for any indirect, incidental, or consequential damages arising from your use of our tools. Your total liability shall not exceed the amount you paid us (which is nothing, since our tools are free).
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of our website after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">8. Contact</h2>
        <p>
          For questions about these Terms, contact us at contact@krynntools.online.
        </p>
      </div>
    </div>
  );
}
