import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Krynn Tools",
  description: "About Krynn Tools. Learn about our free online tools collection.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">About Krynn Tools</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p className="text-lg">
          Krynn Tools is a free collection of 100+ online utilities designed to make your everyday tasks easier.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Our Mission</h2>
        <p>
          We believe that useful tools should be accessible to everyone, without signups, downloads, or paywalls. 
          Our mission is to provide fast, free, and privacy-focused tools that work entirely in your browser.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Privacy First</h2>
        <p>
          Most of our tools process your files entirely within your browser using modern web technologies. 
          This means your files never leave your device — ensuring complete privacy and instant results.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Our Tools</h2>
        <p>We offer tools across 8 categories:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>PDF Tools</strong> – Compress, merge, split, convert PDF files</li>
          <li><strong>Image Tools</strong> – Compress, resize, convert images</li>
          <li><strong>Text Tools</strong> – Word counter, case converter, and more</li>
          <li><strong>Developer Tools</strong> – JSON formatter, Base64 encoder, UUID generator</li>
          <li><strong>Web Design Tools</strong> – CSS gradient generator, color palette generator</li>
          <li><strong>Calculators</strong> – BMI, age, percentage, and unit converters</li>
          <li><strong>Security Tools</strong> – Password generator, hash generator</li>
          <li><strong>Misc Tools</strong> – Barcode generator, dice roller, coin flip, and more</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Contact</h2>
        <p>
          Have questions, suggestions, or feedback? Reach out to us at contact@krynntools.online.
        </p>
      </div>
    </div>
  );
}
