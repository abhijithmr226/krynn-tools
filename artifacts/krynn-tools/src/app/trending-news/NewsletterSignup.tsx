import { useState, useCallback } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitted(true);
      setEmail("");
    },
    [email]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">
            Stay Updated
          </h3>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
          Get the latest trending news and tech insights delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 px-4 py-3 text-sm font-medium text-[var(--color-success)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-all duration-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
            />
            <button
              type="submit"
              className="h-10 w-full cursor-pointer rounded-xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
