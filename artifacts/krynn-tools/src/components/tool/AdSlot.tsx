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
  const [loadError, setLoadError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  const loadAd = useCallback(() => {
    if (!containerRef.current || loadError) return;
    const container = containerRef.current;

    container.innerHTML = "";

    const optScript = document.createElement("script");
    optScript.textContent = `atOptions = ${JSON.stringify({
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    })};`;
    container.appendChild(optScript);

    const invokeScript = document.createElement("script");
    invokeScript.src = config.src;
    invokeScript.async = true;
    invokeScript.onerror = () => setLoadError(true);
    container.appendChild(invokeScript);
  }, [config, loadError]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if ("requestIdleCallback" in window) {
              (window as any).requestIdleCallback(loadAd, { timeout: 2000 });
            } else {
              setTimeout(loadAd, 0);
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loadAd]);

  useEffect(() => {
    if (loadError || !containerRef.current) return;

    const checkForAd = () => {
      if (containerRef.current && containerRef.current.querySelector("iframe")) {
        setAdLoaded(true);
        return true;
      }
      return false;
    };

    if (checkForAd()) return;

    const observer = new MutationObserver(() => {
      if (checkForAd()) observer.disconnect();
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      checkForAd();
      observer.disconnect();
    }, 6000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [loadError]);

  if (loadError) return null;

  return (
    <div className="flex flex-col items-center w-full">
      {adLoaded && (
        <div className="text-center text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1.5 uppercase tracking-wider">
          Advertisement
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: config.width,
          height: config.height,
          maxWidth: "100%",
          overflow: "hidden",
          minHeight: adLoaded ? undefined : 0,
        }}
      />
    </div>
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

  if (position === "mobile-anchor") {
    if (!isMobile) return null;
    return (
      <div className="fixed bottom-16 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-lg">
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

  const adSize: keyof typeof ADS = isMobile ? "320x50"
    : position === "sidebar" ? "728x90"
    : position === "in-content" ? "728x90"
    : "468x60";

  return (
    <div className={`my-6 ${className}`}>
      <div className="flex justify-center">
        <AdUnit size={adSize} />
      </div>
    </div>
  );
}
