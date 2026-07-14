export default function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="relative aspect-[16/10] w-full bg-[var(--color-muted)]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-border)]/10 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>

      <div className="p-5">
        <div className="mb-3 h-3 w-20 rounded-full bg-[var(--color-muted)]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.1s" }} />
        </div>

        <div className="mb-2 space-y-2">
          <div className="h-5 w-full rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.2s" }} />
          </div>
          <div className="h-5 w-3/4 rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.3s" }} />
          </div>
        </div>

        <div className="mb-4 space-y-1.5">
          <div className="h-3.5 w-full rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.4s" }} />
          </div>
          <div className="h-3.5 w-5/6 rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.5s" }} />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-24 rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.6s" }} />
          </div>
          <div className="h-3 w-3 rounded bg-[var(--color-muted)]" />
          <div className="h-3 w-16 rounded bg-[var(--color-muted)]">
            <div className="h-full w-full rounded bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.7s" }} />
          </div>
        </div>

        <div className="flex gap-1.5 mb-4">
          <div className="h-5 w-14 rounded bg-[var(--color-muted)]" />
          <div className="h-5 w-12 rounded bg-[var(--color-muted)]" />
          <div className="h-5 w-16 rounded bg-[var(--color-muted)]" />
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <div className="h-9 w-28 rounded-lg bg-[var(--color-muted)]">
            <div className="h-full w-full rounded-lg bg-gradient-to-r from-transparent via-[var(--color-border)]/15 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite", animationDelay: "0.9s" }} />
          </div>
          <div className="flex gap-1.5">
            <div className="h-8 w-8 rounded-lg bg-[var(--color-muted)]" />
            <div className="h-8 w-8 rounded-lg bg-[var(--color-muted)]" />
            <div className="h-8 w-8 rounded-lg bg-[var(--color-muted)]" />
            <div className="h-8 w-8 rounded-lg bg-[var(--color-muted)]" />
          </div>
        </div>
      </div>
    </article>
  );
}
