import { Link } from "wouter";

const FAQ_DATA = [
  {
    q: "Is my data really never uploaded anywhere?",
    a: "Correct. For all non-AI tools, file data is loaded into your browser's memory using the FileReader API and processed with JavaScript libraries like Canvas, pdf-lib, and the File System Access API. No file bytes are ever transmitted over a network connection. You can verify this yourself by opening your browser's DevTools Network tab while using any tool.",
  },
  {
    q: "What happens to my files after I close the tab?",
    a: "When you close the tab or navigate away, all file data stored in browser memory (RAM) is automatically released by the operating system. There are no hidden copies, no cached copies on disk, and no database records. The data is simply gone.",
  },
  {
    q: "Do AI writing tools send my prompts to a server?",
    a: "Yes. AI writing tools (Essay Writer, Blog Post Generator, etc.) send your text prompts to an OpenRouter API proxy for processing. However, prompts are not stored, logged, or used for training. The proxy is configured with data retention disabled. All other tools — PDF, image, text, developer, and calculator tools — process entirely in your browser.",
  },
  {
    q: "How can I verify that my files are private?",
    a: "Open your browser's DevTools (F12 or right-click → Inspect), go to the Network tab, then use any file tool. You will see JavaScript and CSS files load, but zero file data is transmitted. For advanced users, you can also inspect the page source to confirm the processing libraries (pdf-lib, Canvas API) run client-side.",
  },
];

export default function PrivacyExplainerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]">
        How Your Data Stays Private
      </h1>

      <div className="prose max-w-none text-[var(--color-muted-foreground)] space-y-8">
        <p className="text-lg leading-relaxed">
          Krynn Tools is built on a simple principle: your files should never leave your device. This page
          explains exactly how we achieve that — and how you can verify it yourself.
        </p>

        {/* Browser-Based Processing */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            Browser-Based Processing
          </h2>
          <p>
            Every file tool on Krynn Tools runs entirely inside your web browser using standard JavaScript
            APIs. PDF operations use <strong>pdf-lib</strong>, a pure-JavaScript library that reads and writes
            PDF files without any server dependency. Image tools use the browser&apos;s built-in{" "}
            <strong>Canvas API</strong> and <strong>OffscreenCanvas</strong> to resize, compress, crop, and
            convert images. File inputs are read using the <strong>File API</strong> and{" "}
            <strong>FileReader</strong>, which load raw bytes directly into browser memory.
          </p>
          <p>
            There is no server-side processing pipeline. The code that transforms your files runs in the same
            browser tab you&apos;re looking at — on your CPU, in your RAM, on your device.
          </p>
        </section>

        {/* No Server Uploads */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            No Server Uploads
          </h2>
          <p>
            When you drop a file into any Krynn Tools tool, your browser reads the file using the{" "}
            <strong>FileReader</strong> API and loads the entire contents as an{" "}
            <strong>ArrayBuffer</strong> or <strong>DataTransfer</strong> object. This happens entirely within
            your device&apos;s memory. The file data is then passed directly to the processing library — there
            is no <code>fetch()</code>, <code>XMLHttpRequest</code>, or WebSocket call that transmits file
            bytes to any remote server.
          </p>
          <p>
            Even if you&apos;re on an airplane with no Wi-Fi, most of our tools will still work — because
            they never needed a network connection in the first place.
          </p>
        </section>

        {/* No Storage or Logging */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            No Storage or Logging
          </h2>
          <p>
            Your files exist only in your browser&apos;s working memory (RAM). Krynn Tools does not write file
            data to <code>localStorage</code>, <code>IndexedDB</code>, cookies, or any other persistent
            storage mechanism. There are no background uploads, no analytics hooks that capture file contents,
            and no server-side logs that record what you processed.
          </p>
          <p>
            When you close the tab, navigate to a different page, or when the browser garbage-collects
            unused memory, the file data is destroyed permanently. There are no recoverable copies
            anywhere.
          </p>
        </section>

        {/* How to Verify This */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            How to Verify This Yourself
          </h2>
          <p>
            We encourage you to verify our privacy claims independently:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              Open your browser&apos;s <strong>Developer Tools</strong> (press <code>F12</code>, or
              right-click anywhere and select &quot;Inspect&quot;).
            </li>
            <li>
              Click the <strong>Network</strong> tab. Make sure &quot;Preserve log&quot; is enabled.
            </li>
            <li>
              Open any Krynn Tools file tool (e.g., Compress PDF, Compress Image) and process a file.
            </li>
            <li>
              Observe the network requests. You will see static assets (HTML, CSS, JS) load, but you will{" "}
              <strong>not</strong> see any request that sends file data to a remote server.
            </li>
            <li>
              For extra confidence, filter network requests by &quot;XHR&quot; or &quot;Fetch&quot; — you
              will see zero requests containing your file payload.
            </li>
          </ol>
        </section>

        {/* AI Tools Exception */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            AI Tools Exception — Transparent Disclosure
          </h2>
          <p>
            We believe in full transparency. While all file-processing tools run entirely in your browser,
            our <strong>AI Writing Tools</strong> (Essay Writer, Blog Post Generator, Content Improver,
            Grammar Fixer, etc.) work differently. These tools send your text prompts to an{" "}
            <strong>OpenRouter API proxy</strong> for processing by large language models.
          </p>
          <p>
            <strong>What this means:</strong> The text you type into an AI tool is transmitted over HTTPS to
            the API proxy. However, the proxy is configured with <strong>data retention disabled</strong>{" "}
            — prompts are not stored, logged, or used to train AI models. The request is processed and the
            response is returned; the data is not kept afterward.
          </p>
          <p>
            <strong>What this does NOT apply to:</strong> All PDF tools, image tools, text tools (word
            counter, case converter, etc.), developer tools, calculators, security tools, and social media
            tools process everything in your browser with zero network transmission of your data.
          </p>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
            Learn More
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link href="/about" className="text-[var(--color-primary)] hover:underline">
                About Krynn Tools
              </Link>{" "}
              — our mission and values
            </li>
            <li>
              <Link href="/privacy-policy" className="text-[var(--color-primary)] hover:underline">
                Privacy Policy
              </Link>{" "}
              — the full legal privacy policy
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <summary className="cursor-pointer px-6 py-4 font-semibold text-sm text-[var(--color-foreground)] flex items-center justify-between list-none">
                  {q}
                  <span className="text-[var(--color-muted-foreground)] group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "How Your Data Stays Private — Krynn Tools",
            description:
              "Learn how Krynn Tools keeps your files private by processing everything in your browser. No uploads, no storage, no tracking. Verify it yourself.",
            url: "https://www.krynntools.online/privacy-explainer",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krynntools.online" },
                { "@type": "ListItem", position: 2, name: "Privacy Explainer", item: "https://www.krynntools.online/privacy-explainer" },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
