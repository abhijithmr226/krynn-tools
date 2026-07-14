export default function TrustpilotCta() {
  return (
    <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
      <div className="flex justify-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= 4 ? "#00b67a" : "#dcdce6"}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className="text-sm font-semibold text-[var(--color-foreground)] mb-1">Found this helpful?</p>
      <p className="text-xs text-[var(--color-muted-foreground)] mb-4">Let others know on Trustpilot — it takes 30 seconds.</p>
      <a
        href="https://www.trustpilot.com/evaluate/krynntools.online"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#00b67a] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#009c6a] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Review us on Trustpilot
      </a>
    </div>
  );
}
