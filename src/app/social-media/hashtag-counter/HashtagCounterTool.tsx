"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

type Platform = "instagram" | "tiktok" | "twitter";

interface PlatformLimits {
  label: string;
  max: number | null;
  recommended: string;
  bestPractice: string;
}

const PLATFORMS: Record<Platform, PlatformLimits> = {
  instagram: { label: "Instagram", max: 30, recommended: "3–5 hashtags for best reach", bestPractice: "Best practice: 3–5 for reach, max 30 allowed" },
  tiktok: { label: "TikTok", max: null, recommended: "5–8 hashtags recommended", bestPractice: "No hard limit, but 5–8 hashtags perform best" },
  twitter: { label: "Twitter / X", max: null, recommended: "1–2 hashtags ideal", bestPractice: "Hashtags don't count against 280 char limit" },
};

const CATEGORIES = [
  { label: "Popular", tags: ["#love", "#instagood", "#trending", "#viral", "#fyp", "#explore", "#follow", "#like", "#photooftheday", "#beautiful"] },
  { label: "Photography", tags: ["#photography", "#photo", "#photographer", "#photographylovers", "#naturephotography", "#portrait", "#landscape", "#streetphotography", "#canonphotography", "#nikon"] },
  { label: "Food", tags: ["#food", "#foodie", "#foodporn", "#instafood", "#foodphotography", "#healthyfood", "#homecooking", "#yummy", "#delicious", "#recipe"] },
  { label: "Travel", tags: ["#travel", "#travelgram", "#wanderlust", "#travelphotography", "#explore", "#vacation", "#instatravel", "#adventure", "#traveltheworld", "#trip"] },
  { label: "Fitness", tags: ["#fitness", "#gym", "#workout", "#fitnessmotivation", "#fit", "#bodybuilding", "#health", "#training", "#motivation", "#gains"] },
];

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? [...new Set(matches.map((h) => h.toLowerCase()))] : [];
}

function getProgressColor(count: number, max: number): string {
  const pct = (count / max) * 100;
  if (pct < 60) return "bg-green-500";
  if (pct < 90) return "bg-yellow-500";
  return "bg-red-500";
}

function getProgressColorHex(count: number, max: number): string {
  const pct = (count / max) * 100;
  if (pct < 60) return "#22c55e";
  if (pct < 90) return "#eab308";
  return "#ef4444";
}

export default function HashtagCounterTool({ relatedTools, schema }: Props) {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [copiedAll, setCopiedAll] = useState(false);

  const hashtags = useMemo(() => extractHashtags(text), [text]);
  const hashtagCount = hashtags.length;
  const hashtagCharCount = useMemo(() => hashtags.join(" ").length, [hashtags]);
  const fullCharCount = text.length;
  const platformInfo = PLATFORMS[platform];

  const progressPct = useMemo(() => {
    if (!platformInfo.max) return 0;
    return Math.min((hashtagCount / platformInfo.max) * 100, 100);
  }, [hashtagCount, platformInfo.max]);

  const progressColor = useMemo(() => {
    if (!platformInfo.max) return "bg-green-500";
    return getProgressColor(hashtagCount, platformInfo.max);
  }, [hashtagCount, platformInfo.max]);

  const handleCopyAll = useCallback(async () => {
    if (hashtags.length === 0) return;
    await navigator.clipboard.writeText(hashtags.join(" "));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }, [hashtags]);

  const handleRemoveHashtag = useCallback((tag: string) => {
    setText((prev) => {
      const regex = new RegExp(`\\b${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      return prev.replace(regex, "").replace(/\s{2,}/g, " ").trim();
    });
  }, []);

  const handleInsertCategory = useCallback((tags: string[]) => {
    const existing = text.trim();
    const newTags = tags.filter((t) => !extractHashtags(existing).includes(t.toLowerCase()));
    if (existing) {
      setText(existing + " " + newTags.join(" "));
    } else {
      setText(newTags.join(" "));
    }
  }, [text]);

  const handleClear = useCallback(() => setText(""), []);

  return (
    <ToolLayout
      title="Hashtag Counter & Generator"
      subtitle="Count hashtags in your text and get suggestions. Perfect for Instagram, TikTok, and Twitter posts."
      howToUse={[
        "Type or paste your post text into the text area below.",
        "Select the platform you are posting to for accurate limits.",
        "View the real-time hashtag count and progress bar.",
        "Use the preset category buttons to quickly insert popular hashtags.",
      ]}
      faq={[
        { question: "What is the Instagram hashtag limit?", answer: "Instagram allows a maximum of 30 hashtags per post. However, best practice suggests using 3–5 hashtags for optimal engagement and reach." },
        { question: "Do hashtags count against the Twitter character limit?", answer: "No. Hashtags on Twitter/X are included in the 280 character limit. However, using 1–2 hashtags is considered ideal for engagement." },
        { question: "How many hashtags should I use on TikTok?", answer: "TikTok doesn't enforce a hard hashtag limit, but using 5–8 relevant hashtags is recommended for best visibility." },
        { question: "Is my text stored or uploaded?", answer: "No. All processing happens in your browser. Your text is never sent to any server." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1">
          {(Object.keys(PLATFORMS) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                platform === p
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              }`}
            >
              {PLATFORMS[p].label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your post here or type hashtags directly... (e.g. #photography #travel #love)"
            className="min-h-[200px] w-full resize-y border-0 bg-transparent p-4 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
          />
        </div>

        {platformInfo.max && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Hashtag Count</span>
              <span className={`text-sm font-bold ${hashtagCount > platformInfo.max ? "text-red-500" : "text-[var(--color-foreground)]"}`}>
                {hashtagCount} / {platformInfo.max}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">{platformInfo.bestPractice}</p>
          </div>
        )}

        {!platformInfo.max && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Hashtag Count</span>
              <span className="text-sm font-bold text-[var(--color-foreground)]">{hashtagCount}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">{platformInfo.bestPractice}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{hashtagCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Hashtags</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{hashtagCharCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Hashtag Chars</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{fullCharCount}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Total Chars</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: getProgressColorHex(hashtagCount, platformInfo.max || 30) }}>
              {platformInfo.max ? Math.max(0, platformInfo.max - hashtagCount) : "—"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Remaining</p>
          </div>
        </div>

        {hashtags.length > 0 && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Detected Hashtags</h3>
              <button onClick={handleCopyAll} className="text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
                {copiedAll ? "Copied!" : "Copy All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)]"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveHashtag(tag)}
                    className="ml-0.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] transition-colors cursor-pointer"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">Quick Insert Categories</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleInsertCategory(cat.tags)}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              >
                + {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleClear} disabled={!text} className="btn-secondary px-6 py-2.5 font-semibold cursor-pointer disabled:opacity-50">
            Clear
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
