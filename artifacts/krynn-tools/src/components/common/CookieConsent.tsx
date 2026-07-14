import { useState, useEffect, useRef } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => { localStorage.setItem("cookie-consent", "accepted"); setShow(false); };
  const decline = () => { localStorage.setItem("cookie-consent", "declined"); setShow(false); };

  useEffect(() => {
    if (show) document.body.classList.add("has-cookie-banner");
    else document.body.classList.remove("has-cookie-banner");
    return () => document.body.classList.remove("has-cookie-banner");
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-[calc(64px+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderTop: "1px solid var(--glass-border)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:py-4">
        <p className="text-xs sm:text-sm text-[var(--color-foreground)] leading-snug">
          <span className="hidden sm:inline">
            We use cookies for analytics and advertising (Google AdSense). Your files are processed locally and never leave your browser.{" "}
          </span>
          <span className="sm:hidden">
            We use cookies for analytics &amp; ads. Files stay in your browser.{" "}
          </span>
          <a href="/cookie-policy" className="underline text-[var(--color-primary)] whitespace-nowrap">
            Learn more
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={decline} className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
