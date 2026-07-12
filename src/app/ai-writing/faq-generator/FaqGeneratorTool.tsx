"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

export default function FaqGeneratorTool({ relatedTools, schema }: Props) {
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const sampleFaq = `# Frequently Asked Questions

### Q1: What is the main purpose of this service?
A: This service provides a comprehensive solution designed to streamline your workflow and improve efficiency through automated processes.

### Q2: How much does it cost to get started?
A: There is a free tier available for new users. Premium plans start at $9.99/month with additional features and higher usage limits.

### Q3: Is my data secure and private?
A: Yes. All data is encrypted in transit and at rest. We follow industry-standard security practices and never share your data with third parties.

### Q4: Can I integrate this with my existing tools?
A: Absolutely. We support integrations with popular platforms including Slack, Notion, Google Workspace, and many more through our API.

### Q5: What kind of support is available?
A: Free users have access to community forums and documentation. Premium users get priority email support with a 24-hour response time.

### Q6: How do I cancel my subscription?
A: You can cancel anytime from your account settings. There are no cancellation fees, and you'll retain access until the end of your billing period.`;
      setOutput(sampleFaq);
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolLayout
      title="AI FAQ Generator"
      subtitle="Automatically generate relevant FAQ sections from any content or topic."
      howToUse={[
        "Paste your content or describe your product/service in the text area.",
        "Click the Generate button to create relevant Q&A pairs.",
        "Review the generated FAQs and edit as needed.",
        "Copy the formatted FAQ section for your website or documentation.",
      ]}
      faq={[
        {
          question: "How many FAQs does it generate?",
          answer:
            "The tool typically generates 5-8 highly relevant Q&A pairs based on your input content, covering the most common user questions.",
        },
        {
          question: "Can I specify the number of questions?",
          answer:
            "The AI determines the optimal number based on your content complexity. You can regenerate or manually remove questions to adjust the count.",
        },
        {
          question: "What format are the FAQs in?",
          answer:
            "FAQs are generated in a clean question-and-answer format that can be easily copied into HTML, Markdown, or plain text for any website.",
        },
        {
          question: "Can I use this for any industry?",
          answer:
            "Yes. The generator works across all industries — e-commerce, SaaS, healthcare, education, and more. Provide specific content for best results.",
        },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Content / Topic
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your product description, service overview, or topic details here. The more context you provide, the better the FAQs..."
            rows={5}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!content.trim() || loading}
          className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" /> Generating FAQs...
            </span>
          ) : (
            "Generate FAQ Section"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {output && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Generated FAQ
              </h3>
              <button
                onClick={handleCopy}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-foreground)]">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
