"use client";

import { useState, useEffect, useRef } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add("has-cookie-banner");
    } else {
      document.body.classList.remove("has-cookie-banner");
      document.documentElement.style.removeProperty("--banner-height");
    }
    return () => {
      document.body.classList.remove("has-cookie-banner");
      document.documentElement.style.removeProperty("--banner-height");
    };
  }, [show]);

  useEffect(() => {
    if (!show || !bannerRef.current) return;

    const updateHeight = () => {
      if (bannerRef.current) {
        const height = bannerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--banner-height", `${height}px`);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(bannerRef.current);

    return () => {
      observer.disconnect();
    };
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
        padding: "var(--space-4) var(--space-4)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm text-[var(--color-foreground)]">
            We use cookies for analytics and advertising (Google AdSense). By clicking &quot;Accept&quot;, you consent to the use of cookies. 
            Your files are processed locally and never leave your browser.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="btn-secondary text-sm"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="btn-primary text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
