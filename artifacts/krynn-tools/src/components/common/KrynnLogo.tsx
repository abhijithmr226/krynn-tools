/**
 * KrynnLogo — Uses the actual dragon K mark from /favicon-96x96.png (transparent
 * background, brand-red icon) paired with CSS-variable-driven text so it adapts
 * perfectly in both light and dark mode.
 *
 * "KRYNN" — uses `color: var(--color-foreground)` → dark in light mode, white in dark mode
 * "TOOLS" — always brand-red via CSS variable
 */
interface KrynnLogoProps {
  /** Total height of the logo in px. Everything scales from this. */
  height?: number;
  className?: string;
}

export default function KrynnLogo({ height = 38, className }: KrynnLogoProps) {
  // Proportions match the original brand logo:
  // K icon is roughly square, text sits alongside it.
  const iconH = height;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(height * 0.22) + "px",
        height: iconH,
        userSelect: "none",
        flexShrink: 0,
      }}
      aria-label="Krynn Tools"
      role="img"
    >
      {/* ── Dragon K mark — pixel-perfect from brand assets ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon-96x96.png"
        alt=""
        aria-hidden="true"
        width={iconH}
        height={iconH}
        style={{
          display: "block",
          width: iconH,
          height: iconH,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />

      {/* ── Wordmark ── */}
      <div
        className="hidden sm:flex"
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
          gap: Math.round(height * 0.06) + "px",
        }}
      >
        {/* "KRYNN" — inherits foreground color for dark-mode adaptation */}
        <span
          style={{
            fontSize: Math.round(height * 0.62) + "px",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "var(--color-foreground)",
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
          }}
        >
          KRYNN
        </span>

        {/* "TOOLS" — always brand red */}
        <span
          style={{
            fontSize: Math.round(height * 0.38) + "px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "var(--color-primary)",
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            lineHeight: 1,
          }}
        >
          TOOLS
        </span>
      </div>
    </div>
  );
}
