import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Props {
  relatedTools: Array<{ name: string; slug: string; categorySlug: string }>;
  schema: object;
}

// A robust, fast client-side markdown to HTML renderer
function parseMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // ── Block elements ──
  
  // Code blocks: ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-[var(--color-muted)] p-4 rounded-lg font-mono text-sm overflow-x-auto my-3 border border-[var(--color-border)]">${code.trim()}</pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[var(--color-muted)] px-1.5 py-0.5 rounded font-mono text-xs border border-[var(--color-border)]">$1</code>');

  // Headings: # H1, ## H2, ### H3
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-[var(--color-foreground)]">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2.5 pb-1 border-b border-[var(--color-border)] text-[var(--color-foreground)]">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-black mt-6 mb-3 pb-1.5 border-b border-[var(--color-border)] text-[var(--color-foreground)]">$1</h1>');

  // Blockquotes: > quote
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-[var(--color-primary)] bg-[var(--color-muted)] pl-4 py-2 my-3 rounded-r text-[var(--color-muted-foreground)]">$1</blockquote>');

  // Unordered list: - item or * item
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc ml-5 my-1 text-[var(--color-foreground)]">$1</li>');
  
  // Ordered list: 1. item
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="list-decimal ml-5 my-1 text-[var(--color-foreground)]">$1</li>');

  // Bold/Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

  // Links: [label](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-primary)] underline font-semibold">$1</a>');

  // Paragraphs (lines that aren't parts of lists/blocks)
  const lines = html.split("\n");
  const parsedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "<br />";
    if (trimmed.startsWith("<h") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<li") || trimmed.startsWith("<pre") || trimmed.startsWith("<code")) {
      return line;
    }
    return `<p class="my-2.5 leading-relaxed text-[var(--color-foreground)]">${line}</p>`;
  });

  return parsedLines.join("\n");
}

const DEFAULT_MARKDOWN = `# Live Markdown Previewer

Welcome to the **Krynn Tools** Markdown Editor! 

## Features
- Edit markdown in real-time.
- View immediate HTML rendering.
- Fully mobile compatible and responsive.

### Blockquotes Example
> "Your files never leave your device. All calculations are performed instantly using client-side JavaScript."

### Code Block
\`\`\`javascript
const testSpeed = (mbps) => {
  return mbps >= 50 ? "Excellent" : "Average";
};
\`\`\`

Created by [Krynn Tools](https://www.krynntools.online).
`;

export default function MarkdownPreviewerTool({ relatedTools, schema }: Props) {
  const [input, setInput] = useState(DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const renderedHtml = useMemo(() => parseMarkdown(input), [input]);

  const handleDownload = () => {
    const blob = new Blob([input], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Markdown Previewer Online Free"
      subtitle="Edit Markdown and preview HTML output side-by-side or on the fly."
      howToUse={[
        "Type or paste your Markdown syntax in the Editor panel.",
        "Toggle between the Editor and Live Preview tabs on mobile, or see them side-by-side on desktop.",
        "Download your raw Markdown file once you are finished.",
      ]}
      faq={[
        { question: "Is my text shared?", answer: "No. The parsing is done entirely in your browser using local regex. No data is sent to external servers." },
        { question: "What Markdown features are supported?", answer: "It supports standard features including headers, bold, italic, code blocks, lists, blockquotes, and links." },
        { question: "Can I download my edits?", answer: "Yes, click the Download MD button to save your formatted markdown file." },
      ]}
      relatedTools={relatedTools}
      schema={schema}
    >
      <div className="space-y-4">
        
        {/* Mobile Tab Selectors */}
        <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1 md:hidden">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 rounded-md py-2 text-center text-xs font-bold transition-all ${
              activeTab === "edit"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 rounded-md py-2 text-center text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Editor and Preview container */}
        <div className="grid gap-4 md:grid-cols-2">
          
          {/* Editor Panel */}
          <div className={`space-y-2 ${activeTab === "edit" ? "block" : "hidden md:block"}`}>
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">Markdown Editor</span>
              <button
                onClick={handleDownload}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Download MD
              </button>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your markdown here..."
                className="min-h-[360px] md:min-h-[460px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`space-y-2 ${activeTab === "preview" ? "block" : "hidden md:block"}`}>
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">Live HTML Preview</span>
              <button
                onClick={() => setInput("")}
                className="text-xs font-bold text-[var(--color-destructive)] hover:underline cursor-pointer"
              >
                Clear Editor
              </button>
            </div>
            <div 
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 min-h-[360px] md:min-h-[460px] overflow-y-auto"
              style={{ maxHeight: "540px" }}
              dangerouslySetInnerHTML={{ __html: renderedHtml || "<p class='text-sm text-[var(--color-muted-foreground)]'>Nothing to preview yet...</p>" }}
            />
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
