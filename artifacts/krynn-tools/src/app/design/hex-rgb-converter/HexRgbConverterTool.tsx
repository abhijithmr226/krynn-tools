import { useState, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
  );
}

export default function HexRgbConverterTool({ relatedTools, schema }: Props) {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [activeTab, setActiveTab] = useState<"hex" | "rgb">("hex");
  const [copied, setCopied] = useState("");
  const [hexError, setHexError] = useState("");

  const handleHexChange = useCallback((value: string) => {
    let cleaned = value;
    if (!cleaned.startsWith("#")) cleaned = "#" + cleaned;
    setHex(cleaned);
    const parsed = hexToRgb(cleaned);
    if (parsed) {
      setHexError("");
      setRgb(parsed);
    } else {
      setHexError("Invalid HEX color code");
    }
  }, []);

  const handleRgbChange = useCallback(
    (channel: "r" | "g" | "b", value: number) => {
      const clamped = Math.max(0, Math.min(255, Math.round(value)));
      const newRgb = { ...rgb, [channel]: clamped };
      setRgb(newRgb);
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    },
    [rgb]
  );

  useEffect(() => {
    const parsed = hexToRgb(hex);
    if (parsed) setRgb(parsed);
  }, []);

  const previewColor = hexToRgb(hex) ? hex : "#000000";

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolLayout
      title="HEX to RGB Converter Free"
      subtitle="Convert between HEX and RGB color codes instantly."
      howToUse={[
        "Enter a HEX color code (e.g. #3b82f6) or use the RGB sliders to adjust values.",
        "See the live color preview update in real time as you make changes.",
        "Click the copy button to copy the HEX or RGB value to your clipboard.",
      ]}
      faq={[
        { question: "What is the difference between HEX and RGB?", answer: "HEX uses a 6-digit hexadecimal string (e.g. #FF5733) to represent colors, while RGB uses three decimal values (0-255) for red, green, and blue channels. Both represent the same colors." },
        { question: "Why is my HEX code showing as invalid?", answer: "A valid HEX code must be exactly 6 characters after the # symbol, using only digits 0-9 and letters a-f (case-insensitive). Make sure there are no extra characters." },
        { question: "Does this tool work offline?", answer: "Yes. The conversion happens entirely in your browser — no data is sent to any server. You can use it offline after the page loads." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div
          className="h-32 w-full rounded-lg border-2 border-[var(--color-border)]"
          style={{ backgroundColor: previewColor }}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("hex")}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "hex"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
            }`}
          >
            HEX
          </button>
          <button
            onClick={() => setActiveTab("rgb")}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "rgb"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
            }`}
          >
            RGB
          </button>
        </div>

        {activeTab === "hex" && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-4">
            <label className="block text-sm font-medium text-[var(--color-foreground)]">HEX Color Code</label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="#3b82f6"
                maxLength={7}
              />
              <div
                className="h-12 w-12 shrink-0 rounded-lg border border-[var(--color-border)]"
                style={{ backgroundColor: hexToRgb(hex) ? hex : "#000" }}
              />
              <button
                onClick={() => handleCopy(hex, "hex")}
                className="btn-secondary px-4 py-3 font-semibold cursor-pointer whitespace-nowrap"
              >
                {copied === "hex" ? "Copied!" : "Copy HEX"}
              </button>
            </div>
            {hexError && <p className="text-sm text-red-500">{hexError}</p>}
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-mono text-sm text-[var(--color-muted-foreground)]">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </div>
          </div>
        )}

        {activeTab === "rgb" && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-5">
            {(["r", "g", "b"] as const).map((channel) => {
              const labels = { r: "Red", g: "Green", b: "Blue" };
              const colors = { r: "#ef4444", g: "#22c55e", b: "#3b82f6" };
              return (
                <div key={channel} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[var(--color-foreground)]">
                      {labels[channel]}
                    </label>
                    <span className="font-mono text-sm text-[var(--color-muted-foreground)]">
                      {rgb[channel]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #333, ${colors[channel]})`,
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              );
            })}
            <button
              onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
              className="btn-secondary w-full px-4 py-3 font-semibold cursor-pointer"
            >
              {copied === "rgb" ? "Copied!" : "Copy RGB"}
            </button>
          </div>
        )}

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--color-foreground)]">Color Values</h3>
          <div className="grid gap-2 font-mono text-sm text-[var(--color-muted-foreground)]">
            <div className="flex justify-between">
              <span>HEX:</span>
              <span>{hex}</span>
            </div>
            <div className="flex justify-between">
              <span>RGB:</span>
              <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
            </div>
            <div className="flex justify-between">
              <span>RGBA:</span>
              <span>rgba({rgb.r}, {rgb.g}, {rgb.b}, 1)</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
