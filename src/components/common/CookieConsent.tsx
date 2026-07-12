"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

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

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-lg sm:p-6">
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
