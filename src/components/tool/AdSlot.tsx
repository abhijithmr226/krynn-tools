"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AdSlotProps {
  position: "below-tool" | "in-content" | "sidebar" | "mobile-anchor";
  className?: string;
}

const ADS = {
  "728x90": {
    key: "1741459308f28a4cad58a3a4e25a6895",
    width: 728,
    height: 90,
    src: "https://www.highperformanceformat.com/1741459308f28a4cad58a3a4e25a6895/invoke.js",
  },
  "468x60": {
    key: "7b9ab21942f6718a465860627615dd2f",
    width: 468,
    height: 60,
    src: "https://www.highperformanceformat.com/7b9ab21942f6718a465860627615dd2f/invoke.js",
  },
  "320x50": {
    key: "575f8448b8d8ec66d5a5c756d62e72c0",
    width: 320,
    height: 50,
    src: "https://www.highperformanceformat.com/575f8448b8d8ec66d5a5c756d62e72c0/invoke.js",
  },
};

function AdUnit({ size }: { size: keyof typeof ADS }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = ADS[size];

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Clear previous attempt
    container.innerHTML = "";

    // 1. Create and inject the atOptions inline script FIRST (synchronous)
    const optScript = document.createElement("script");
    optScript.textContent = `atOptions = ${JSON.stringify({
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    })};`;
    container.appendChild(optScript);

    // 2. Then load the invoke script (reads atOptions and creates iframe)
    const invokeScript = document.createElement("script");
    invokeScript.src = config.src;
    invokeScript.async = true;
    container.appendChild(invokeScript);
  }, [config]);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  return (
    <div
      ref={containerRef}
      style={{
        width: config.width,
        height: config.height,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    />
  );
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setVisible(true);
  }, []);

  if (!visible || dismissed) return null;

  // Mobile anchor ad
  if (position === "mobile-anchor") {
    if (!isMobile) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-lg">
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200 cursor-pointer z-10"
            aria-label="Close ad"
          >
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <AdUnit size="320x50" />
        </div>
      </div>
    );
  }

  const adSize: keyof typeof ADS = position === "sidebar" ? "728x90"
    : position === "in-content" ? "728x90"
    : "468x60";

  return (
    <div className={`my-6 ${className}`}>
      <div className="text-center text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
        Advertisement
      </div>
      <div className="flex justify-center">
        <AdUnit size={adSize} />
      </div>
    </div>
  );
}
