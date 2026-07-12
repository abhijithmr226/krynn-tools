import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Krynn Tools",
  description: "Contact Krynn Tools. Get in touch with us.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">Contact Us</h1>
      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-6">
        <p className="text-lg">
          Have questions, suggestions, or need support? We&apos;d love to hear from you.
        </p>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--color-foreground)]">Email Us</h2>
          <p>
            For general inquiries, feedback, or support: <strong>contact@krynntools.online</strong>
          </p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--color-foreground)]">Report a Bug</h2>
          <p>
            Found a bug or issue with one of our tools? Please email us with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>The tool name</li>
            <li>What you were trying to do</li>
            <li>What happened instead</li>
            <li>Your browser and device</li>
          </ul>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--color-foreground)]">Request a Tool</h2>
          <p>
            Want us to build a specific tool? Let us know! We&apos;re always looking to expand our collection.
          </p>
        </div>
      </div>
    </div>
  );
}
