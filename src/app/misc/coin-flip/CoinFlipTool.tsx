"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type CoinSide = "heads" | "tails";

function flipCoin(): CoinSide {
  const array = new Uint8Array(1);
  crypto.getRandomValues(array);
  return array[0] % 2 === 0 ? "heads" : "tails";
}

// ── Web Audio Synth Sound Effects (Zero-dependency, premium interaction) ──
const playFlipSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Metallic chime oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.2); // E6

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Audio Context blocked or unsupported
  }
};

const playLandSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    // Low metallic click
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    // Create a tiny burst of white noise for the impact crunch
    const bufferSize = ctx.sampleRate * 0.05; // 50ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1000;

    noise.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    osc.connect(gainNode);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    gainNode.connect(ctx.destination);

    osc.start();
    noise.start();
    osc.stop(ctx.currentTime + 0.15);
    noise.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Audio Context blocked or unsupported
  }
};

export default function CoinFlipTool({ relatedTools, schema }: Props) {
  const [result, setResult] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<CoinSide[]>([]);
  const [flipCount, setFlipCount] = useState({ heads: 0, tails: 0 });

  // Animation states
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [shadowScale, setShadowScale] = useState(1);
  const [shadowOpacity, setShadowOpacity] = useState(0.4);

  const flipSequenceId = useRef<number | null>(null);

  const handleFlip = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    playFlipSound();

    const nextSide = flipCoin();
    
    // Choose random number of full 360-deg spins (between 4 and 6 spins)
    const extraSpins = 4 + Math.floor(Math.random() * 3);
    const targetDeg = extraSpins * 360 + (nextSide === "tails" ? 180 : 0);
    
    // Add random tilt on X axis to make it spin on a real 3D slant
    const targetTiltX = -20 + Math.floor(Math.random() * 40); // -20 to +20 deg

    // Animate: jump UP and spin
    setTranslateY(-180);
    setScale(1.2);
    setRotationY(targetDeg);
    setRotationX(targetTiltX);
    setShadowScale(0.3);
    setShadowOpacity(0.08);

    // Mid-air peak transition to fall down
    if (flipSequenceId.current) clearTimeout(flipSequenceId.current);
    
    flipSequenceId.current = window.setTimeout(() => {
      // Land back on the surface
      setTranslateY(0);
      setScale(1);
      setRotationX(0); // Settle flat
      setShadowScale(1);
      setShadowOpacity(0.45);
      
      // Let rotation Y settle exactly to target
      setTimeout(() => {
        playLandSound();
        setResult(nextSide);
        setHistory((prev) => [nextSide, ...prev].slice(0, 10));
        setFlipCount((prev) => ({
          ...prev,
          [nextSide]: prev[nextSide] + 1,
        }));
        setIsFlipping(false);
      }, 350);
    }, 450);

  }, [isFlipping]);

  return (
    <ToolLayout
      title="Coin Flip Online Free"
      subtitle="Flip a virtual coin online. Heads or tails — random coin flip generator."
      howToUse={[
        "Click the \"Flip Coin\" button or tap the coin itself to initiate a flip.",
        "Watch the realistic 3D coin toss animation and listen to the metallic sound effect.",
        "Check the result, view your history, and analyze the distribution statistics.",
      ]}
      faq={[
        { question: "Is the coin flip outcome truly fair?", answer: "Yes. The coin flip uses the browser's Web Crypto API (crypto.getRandomValues) to generate cryptographically secure pseudo-random numbers, resulting in a true 50/50 probability." },
        { question: "Are the coin sounds synthetic?", answer: "Yes! The sound effects are synthesized live in your browser using the Web Audio API, which means no external audio assets need to load." },
        { question: "Can I use this tool on a phone?", answer: "Absolutely. The layout is optimized to be responsive and looks beautiful on any smartphone, tablet, or desktop computer." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="flex flex-col items-center gap-8 py-4">
        
        {/* ── 3D Coin Arena ── */}
        <div 
          className="relative flex flex-col items-center justify-center" 
          style={{ height: "280px", width: "100%" }}
        >
          {/* Perspective wrapper */}
          <div
            onClick={handleFlip}
            style={{
              perspective: "1000px",
              width: "180px",
              height: "180px",
              cursor: isFlipping ? "default" : "pointer",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* The 3D Coin structure */}
            <div
              style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transform: `translateY(${translateY}px) scale(${scale}) rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
                transition: isFlipping 
                  ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)" 
                  : "transform 0.4s ease-out",
                position: "absolute",
              }}
            >
              {/* HEADS face */}
              <div
                className="absolute inset-0 rounded-full bg-[#D4AF37] shadow-inner"
                style={{
                  backfaceVisibility: "hidden",
                  clipPath: "circle(50% at 50% 50%)",
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.25)",
                  border: "5px solid #E5C158",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/coin-heads.jpg"
                  alt="Heads"
                  width={180}
                  height={180}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    clipPath: "circle(50% at 50% 50%)",
                  }}
                />
              </div>

              {/* TAILS face */}
              <div
                className="absolute inset-0 rounded-full bg-[#D4AF37] shadow-inner"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  clipPath: "circle(50% at 50% 50%)",
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.25)",
                  border: "5px solid #E5C158",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/coin-tails.jpg"
                  alt="Tails"
                  width={180}
                  height={180}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    clipPath: "circle(50% at 50% 50%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic 3D shadow underneath the coin */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              width: "140px",
              height: "14px",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: `scale(${shadowScale})`,
              opacity: shadowOpacity,
              transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>

        {/* ── Flip Button ── */}
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="btn-primary px-10 py-3.5 text-lg font-bold disabled:opacity-50"
          style={{ minWidth: "180px" }}
        >
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </button>

        {/* ── Result display ── */}
        {result && !isFlipping && (
          <div className="animate-fade-up rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-8 py-3 text-center shadow-sm">
            <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Result: </span>
            <span className="text-xl font-extrabold capitalize text-[var(--color-primary)] ml-1">{result}</span>
          </div>
        )}

        {/* ── Score counts ── */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm text-center">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
            <div className="text-2xl font-black text-[var(--color-primary)]">{flipCount.heads}</div>
            <div className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-0.5">Heads</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
            <div className="text-2xl font-black text-[#D4AF37]">{flipCount.tails}</div>
            <div className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-0.5">Tails</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
            <div className="text-2xl font-black text-[var(--color-foreground)]">{flipCount.heads + flipCount.tails}</div>
            <div className="text-xs font-semibold text-[var(--color-muted-foreground)] mt-0.5">Total</div>
          </div>
        </div>

        {/* ── Flip History ── */}
        {history.length > 0 && (
          <div className="w-full max-w-md mt-2">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-foreground)] uppercase tracking-wider text-center">Flip History</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {history.map((side, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                    side === "heads"
                      ? "bg-[var(--color-primary-xlight)] text-[var(--color-primary)] border border-[var(--color-primary)]/10"
                      : "bg-[#FFFCEF] text-[#B08D25] border border-[#D4AF37]/15 dark:bg-[#2a2000] dark:text-[#D4AF37] dark:border-[#D4AF37]/25"
                  }`}
                  style={{ animation: "fadeUp 0.25s ease both" }}
                >
                  {side === "heads" ? "👑" : "🦅"} {side}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
