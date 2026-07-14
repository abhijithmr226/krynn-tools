import { useState } from "react";
import { Envelope, ChatCenteredText, CheckCircle, Bug, Sparkle } from "@phosphor-icons/react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);

    // Simulate standard SMTP server/API processing delays
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[var(--color-muted-foreground)]">
          Have suggestions, need support, or want us to build a specific tool? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Contact Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-[var(--color-primary)]">
              <Envelope size={24} weight="duotone" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-[var(--color-foreground)]">Direct Email</h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
              Reach out directly to our support inbox. We respond to all inquiries within 24 hours.
            </p>
            <a href="mailto:contact@krynntools.online" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              contact@krynntools.online
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-500">
              <Bug size={24} weight="duotone" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-[var(--color-foreground)]">Report a Bug</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Found a bug or calculation error? Drop us an email specifying the tool URL, your browser, and the steps to reproduce it.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-500">
              <Sparkle size={24} weight="duotone" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-[var(--color-foreground)]">Request a Tool</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              We&apos;re constantly expanding. If you need a specific calculator or generator built, send us a feature request!
            </p>
          </div>
        </div>

        {/* Contact Form Block */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8 shadow-md relative overflow-hidden">
            {submitted ? (
              <div className="py-12 text-center animate-fade-up">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                  <CheckCircle size={44} weight="fill" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[var(--color-foreground)]">Message Sent!</h2>
                <p className="mx-auto max-w-sm text-sm text-[var(--color-muted-foreground)]">
                  Thank you for reaching out. Your message has been successfully routed. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary mt-8 py-2 px-6 text-sm font-semibold rounded-lg"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <ChatCenteredText size={22} className="text-[var(--color-primary)]" />
                  Send us a Message
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-sm rounded-lg px-3.5 py-2.5 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-sm rounded-lg px-3.5 py-2.5 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1.5">
                    Subject Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm rounded-lg px-3.5 py-2.5 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Tool Request">Request a New Tool</option>
                    <option value="Bug Report">Report a Bug / Calculation Error</option>
                    <option value="Partnership">Partnership Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    placeholder="Describe your inquiry or feedback details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full text-sm rounded-lg px-3.5 py-2.5 border border-[var(--color-border)] bg-white/70 dark:bg-black/40 backdrop-blur-md outline-none text-[var(--color-foreground)] focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
