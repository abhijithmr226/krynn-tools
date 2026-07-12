"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AdSlotProps {
  position: "below-tool" | "in-content" | "sidebar" | "mobile-anchor";
  className?: string;
}

const AD_CONFIGS = {
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

function loadAdScript(src: string, key: string): Promise<void> {
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    // Set atOptions globally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).atOptions = { key, format: "iframe", params: {} };

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function AdUnit({ configKey, width, height }: { configKey: string; width: number; height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const config = AD_CONFIGS[configKey as keyof typeof AD_CONFIGS];
    if (!config) return;

    loadAdScript(config.src, config.key).then(() => {
      if (!containerRef.current) return;
      // Create iframe container for the ad
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).atOptions = {
        key: config.key,
        format: "iframe",
        height: config.height,
        width: config.width,
        params: {},
      };
      // Invoke the ad
      const invokeScript = document.createElement("script");
      invokeScript.src = config.src;
      invokeScript.async = true;
      containerRef.current.appendChild(invokeScript);
    });
  }, [configKey]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{ width, height, minHeight: height }}
    />
  );
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setVisible(true);
  }, []);

  const [dismissed, setDismissed] = useState(false);
  const handleClose = useCallback(() => setDismissed(true), []);

  if (!visible || dismissed) return null;

  // Mobile anchor ad (320x50 fixed at bottom)
  if (position === "mobile-anchor") {
    if (!isMobile) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-lg">
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleClose}
            className="absolute -top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200 cursor-pointer z-10"
            aria-label="Close ad"
          >
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <AdUnit configKey="320x50" width={320} height={50} />
        </div>
      </div>
    );
  }

  // Map positions to ad sizes
  const adSize = position === "sidebar" ? "728x90"
    : position === "in-content" ? "728x90"
    : "468x60"; // below-tool

  const config = AD_CONFIGS[adSize];

  return (
    <div className={`my-6 ${className}`}>
      <div className="text-center text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
        Advertisement
      </div>
      <div className="flex justify-center overflow-hidden rounded-md">
        <AdUnit configKey={adSize} width={config.width} height={config.height} />
      </div>
    </div>
  );
}
