"use client";

import { useState, useEffect } from "react";

interface AdSlotProps {
  position: "below-tool" | "in-content" | "sidebar" | "mobile-anchor";
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setVisible(true);
  }, []);

  if (!visible) return null;

  if (position === "mobile-anchor" && isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-lg">
        <div className="relative">
          <button
            onClick={() => setVisible(false)}
            className="absolute -top-1 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)] transition-colors duration-200 cursor-pointer"
            aria-label="Close ad"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center text-xs font-medium text-[var(--color-muted-foreground)] mb-2">
            Advertisement
          </div>
          <div className="flex min-h-[100px] items-center justify-center rounded-lg bg-[var(--color-muted)] border border-dashed border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Ad Space - Google AdSense
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (position === "mobile-anchor" && !isMobile) {
    return null;
  }

  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center text-xs font-medium text-[var(--color-muted-foreground)] mb-2">
        Advertisement
      </div>
      <div className="flex min-h-[250px] items-center justify-center rounded-lg bg-[var(--color-muted)] border border-dashed border-[var(--color-border)]">
        <span className="text-sm text-[var(--color-muted-foreground)]">
          Ad Space - Google AdSense
        </span>
      </div>
    </div>
  );
}
