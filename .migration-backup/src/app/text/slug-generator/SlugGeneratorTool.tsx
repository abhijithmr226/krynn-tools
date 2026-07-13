"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

function toSlug(text: string, separator: string = "-"): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`${separator}+`, "g"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

export default function SlugGeneratorTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = input ? toSlug(input, separator) : "";

  const handleCopy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Slug Generator Online Free"
      subtitle="Convert text to URL-friendly slugs instantly."
      howToUse={[
        "Type or paste your title or text into the input field.",
        "Choose a separator character (hyphen, underscore, or none).",
        "Copy the generated slug to use in your URLs.",
      ]}
      faq={[
        { question: "What is a slug?", answer: "A slug is the part of a URL that identifies a page in a human-readable format. For example, 'my-blog-post' is a slug for a URL like example.com/my-blog-post." },
        { question: "Which separator should I use?", answer: "Hyphens (-) are the most common and SEO-friendly choice. Underscores (_) are sometimes used but hyphens are preferred by search engines." },
        { question: "Are special characters removed?", answer: "Yes. All non-alphanumeric characters except spaces and hyphens are removed. Spaces are converted to the chosen separator." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
            Enter Your Text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. My Awesome Blog Post Title!"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Separator:</label>
          {[
            { value: "-", label: "Hyphen (-)" },
            { value: "_", label: "Underscore (_)" },
            { value: "", label: "None" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSeparator(opt.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                separator === opt.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {slug && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
              Generated Slug:
            </label>
            <div className="flex items-center gap-3">
              <code className="flex-1 rounded-lg bg-[var(--color-background)] p-3 font-mono text-sm text-[var(--color-primary)] overflow-x-auto">
                {slug}
              </code>
              <button
                onClick={handleCopy}
                className="btn-primary shrink-0 px-6 py-2.5 font-semibold cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
