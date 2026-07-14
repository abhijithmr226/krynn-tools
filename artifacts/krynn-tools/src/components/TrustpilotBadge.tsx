import { useEffect, useRef } from "react";

interface TrustpilotBadgeProps {
  templateId?: string;
  businessUnitId?: string;
  height?: number;
  className?: string;
}

export default function TrustpilotBadge({
  templateId = "53aa8912dec7e10d38f59f36",
  businessUnitId = "YOUR_TRUSTPILOT_BUSINESS_UNIT_ID",
  height = 28,
  className = "",
}: TrustpilotBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || businessUnitId === "YOUR_TRUSTPILOT_BUSINESS_UNIT_ID") return;

    const container = ref.current;
    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "trustpilot-widget";
    widget.setAttribute("data-locale", "en-US");
    widget.setAttribute("data-template-id", templateId);
    widget.setAttribute("data-businessunit-id", businessUnitId);
    widget.style.display = "flex";
    widget.style.justifyContent = "center";

    const link = document.createElement("a");
    link.href = "https://www.trustpilot.com/review/krynntools.online";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Trustpilot";
    widget.appendChild(link);

    container.appendChild(widget);

    if (!document.querySelector('script[src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.js"]')) {
      const script = document.createElement("script");
      script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [templateId, businessUnitId]);

  if (businessUnitId === "YOUR_TRUSTPILOT_BUSINESS_UNIT_ID") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} width={height} height={height} viewBox="0 0 24 24" fill={s <= 4 ? "#00b67a" : s === 5 ? "#dcdce6" : "#00b67a"}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">Trustpilot</span>
        <span className="text-xs text-muted-foreground">4.8/5</span>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div ref={ref} style={{ minHeight: height + 8 }} />
    </div>
  );
}
