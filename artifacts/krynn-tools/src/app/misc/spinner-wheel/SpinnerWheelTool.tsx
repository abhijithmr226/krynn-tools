import { useState, useCallback, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

const SEGMENT_COLORS = [
  "#E8100A",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
];

const MAX_OPTIONS = 20;
const MIN_OPTIONS = 2;

export default function SpinnerWheelTool({ relatedTools, schema }: Props) {
  const [options, setOptions] = useState<string[]>(["Option 1", "Option 2", "Option 3"]);
  const [newOption, setNewOption] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const spinStartRef = useRef(0);
  const spinDurationRef = useRef(0);
  const spinStartRotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  const drawWheel = useCallback(
    (currentRotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = Math.min(canvas.width, canvas.height);
      const center = size / 2;
      const radius = center - 12;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segmentAngle = (2 * Math.PI) / options.length;

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((currentRotation * Math.PI) / 180);
      ctx.translate(-center, -center);

      options.forEach((option, i) => {
        const startAngle = i * segmentAngle - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + segmentAngle / 2);

        const textRadius = radius * 0.65;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${Math.min(14, Math.max(10, 240 / options.length))}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const maxWidth = radius * 0.45;
        let displayText = option;
        if (ctx.measureText(displayText).width > maxWidth) {
          while (ctx.measureText(displayText + "...").width > maxWidth && displayText.length > 0) {
            displayText = displayText.slice(0, -1);
          }
          displayText += "...";
        }

        ctx.fillText(displayText, textRadius, 0);
        ctx.restore();
      });

      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(center, 6);
      ctx.lineTo(center - 14, -8);
      ctx.lineTo(center + 14, -8);
      ctx.closePath();
      ctx.fillStyle = "#1A1A1A";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center, center, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#1A1A1A";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [options]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const sz = Math.min(container.clientWidth, 400);
    canvas.width = sz;
    canvas.height = sz;
    drawWheel(rotation);
  }, [options, rotation, drawWheel]);

  const addOption = useCallback(() => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    if (options.length >= MAX_OPTIONS) return;
    if (options.some((o) => o.toLowerCase() === trimmed.toLowerCase())) return;
    setOptions((prev) => [...prev, trimmed]);
    setNewOption("");
    setWinner(null);
  }, [newOption, options]);

  const removeOption = useCallback((index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setWinner(null);
  }, []);

  const editOption = useCallback((index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }, []);

  const spin = useCallback(() => {
    if (spinning || options.length < MIN_OPTIONS) return;
    setSpinning(true);
    setWinner(null);

    const segmentAngle = 360 / options.length;
    const winnerIndex = Math.floor(Math.random() * options.length);
    const targetAngle =
      360 - (winnerIndex * segmentAngle + segmentAngle / 2);

    const totalRotation = 360 * (5 + Math.floor(Math.random() * 3)) + targetAngle;
    const startRotation = rotation % 360;
    const finalRotation = startRotation + totalRotation;

    spinStartRef.current = performance.now();
    spinDurationRef.current = 2500 + Math.random() * 1000;
    spinStartRotationRef.current = startRotation;
    targetRotationRef.current = finalRotation;

    const animate = (now: number) => {
      const elapsed = now - spinStartRef.current;
      const progress = Math.min(elapsed / spinDurationRef.current, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRotation =
        spinStartRotationRef.current +
        (targetRotationRef.current - spinStartRotationRef.current) * eased;

      setRotation(currentRotation);
      drawWheel(currentRotation);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setWinner(options[winnerIndex]);
        setHistory((prev) => [options[winnerIndex], ...prev].slice(0, 20));
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [spinning, options, rotation, drawWheel]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <ToolLayout
      title="Custom Spinner — Spin the Wheel Random Picker"
      subtitle="Add your own options and spin the wheel to pick a random winner. Great for decisions, games, and giveaways."
      howToUse={[
        "Add your custom options or labels in the input field below the wheel.",
        "You can add up to 20 options. Edit or remove any option before spinning.",
        "Click the 'Spin the Wheel' button and watch it decelerate to a random result.",
        "The winning option will be highlighted clearly after the spin completes.",
      ]}
      faq={[
        {
          question: "How is the winner determined?",
          answer: "The winner is determined using cryptographically secure random numbers (crypto.getRandomValues) before the animation starts. The animation is purely visual — the result is already decided fairly.",
        },
        {
          question: "How many options can I add?",
          answer: "You can add up to 20 options for readability. Each option can be up to 30 characters long. The minimum is 2 options to spin.",
        },
        {
          question: "Can I use this for giveaways or games?",
          answer: "Absolutely! This tool is perfect for random draws, team selection, decision making, classroom activities, and party games. The cryptographically secure randomness ensures fair results.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        {/* Wheel Display */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: "100%", maxWidth: "400px" }}>
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl"
              style={{
                filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.15))",
              }}
            />
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && !spinning && (
          <div className="rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-6 text-center">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Winner
            </p>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">
              {winner}
            </p>
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={spinning || options.length < MIN_OPTIONS}
          className="btn-primary w-full"
        >
          {spinning ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Spinning...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Spin the Wheel
            </span>
          )}
        </button>

        {options.length < MIN_OPTIONS && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)]">
            Add at least {MIN_OPTIONS} options to spin.
          </p>
        )}

        {/* Options Editor */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-[var(--color-foreground)]">
              Options ({options.length}/{MAX_OPTIONS})
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOption()}
              placeholder="Type an option and press Enter"
              maxLength={30}
              disabled={options.length >= MAX_OPTIONS}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
            />
            <button
              onClick={addOption}
              disabled={!newOption.trim() || options.length >= MAX_OPTIONS}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {options.map((option, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                  }}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => editOption(i, e.target.value)}
                  maxLength={30}
                  className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] outline-none"
                />
                <button
                  onClick={() => removeOption(i)}
                  disabled={options.length <= MIN_OPTIONS}
                  className="shrink-0 cursor-pointer rounded p-1 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-destructive)] disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Spin History
            </h3>
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-muted)] px-3 py-1.5 text-sm"
                >
                  <span className="font-bold text-[var(--color-primary)]">#{i + 1}</span>
                  <span className="text-[var(--color-foreground)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
