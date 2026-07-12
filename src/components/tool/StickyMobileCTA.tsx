"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StickyMobileCTAProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

export default function StickyMobileCTA({ label, onClick, href }: StickyMobileCTAProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const classes = `fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white shadow-[var(--shadow-lg)] transition-transform duration-200 hover:scale-105 ${pulse ? "animate-pulse" : ""}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  );
}
