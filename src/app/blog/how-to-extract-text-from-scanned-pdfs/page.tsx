import { Metadata } from "next";
import Link from "next/link";
import BlogAd from "../BlogAd";

export const metadata: Metadata = {
  title: "How to Extract Text from Scanned PDFs",
  description: "Learn how to extract text from scanned PDFs using free client-side OCR. Step-by-step guide with privacy-first processing.",
  keywords: ["extract text from pdf","ocr pdf","scanned pdf to text","pdf text extraction"],
  alternates: { canonical: "https://www.krynntools.online/blog/how-to-extract-text-from-scanned-pdfs" },
  openGraph: {
    title: "How to Extract Text from Scanned PDFs",
    description: "Learn how to extract text from scanned PDFs using free client-side OCR. Step-by-step guide with privacy-first processing.",
    type: "article",
    url: "https://www.krynntools.online/blog/how-to-extract-text-from-scanned-pdfs",
    images: [{ url: "https://www.krynntools.online/images/blog/compress-pdf.svg", width: 1200, height: 630 }],
    publishedTime: "2026-07-12T00:00:00Z",
    authors: ["Krynn Tools"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Extract Text from Scanned PDFs",
    description: "Learn how to extract text from scanned PDFs using free client-side OCR. Step-by-step guide with privacy-first processing.",
    images: ["https://www.krynntools.online/images/blog/compress-pdf.svg"],
  },
};

export default function BlogPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
      >
        ← Back to Blog
      </Link>

      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "How to Extract Text from Scanned PDFs — Free OCR Guide",
              description: "Learn how to extract text from scanned PDFs using free client-side OCR tools.",
              datePublished: "2026-07-12",
              author: { "@type": "Organization", name: "Krynn Tools" },
              publisher: { "@type": "Organization", name: "Krynn Tools", logo: { "@type": "ImageObject", url: "/logo.png" } },
              mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.krynntools.online/blog/how-to-extract-text-from-scanned-pdfs" },
            }),
          }}
        />

        <h1 className="mb-4 text-3xl font-bold text-[var(--color-foreground)]">
          How to Extract Text from Scanned PDFs
        </h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>Published: July 12, 2026</span>
          <span>·</span>
          <span>PDF</span>
          <span>·</span>
          <span>6 min read</span>
        </div>

        <BlogAd />

        <div className="prose max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <p>
            Scanned PDFs are everywhere — contracts, receipts, old books, medical records, and
            academic papers. The problem? The text inside them is just an image. You cannot
            search it, copy it, or edit it. That is where OCR (Optical Character Recognition)
            comes in, turning those image-based pages into real, selectable text.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            What Is OCR and Why Does It Matter?
          </h2>
          <p>
            OCR is technology that analyzes each pixel of an image to identify characters,
            words, and layouts. It then converts that visual information into machine-readable
            text. For anyone working with scanned documents, OCR is essential because it makes
            the content searchable, editable, and accessible.
          </p>
          <p>
            Without OCR, a 50-page scanned PDF is essentially 50 images — you cannot
            Ctrl+F to find a name, copy a paragraph into an email, or run text analysis.
            OCR solves all of this.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            The Problem with Most Online OCR Tools
          </h2>
          <p>
            Most free OCR tools require you to upload your document to their servers. This
            raises serious concerns:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Privacy risk:</strong> Sensitive
              documents like contracts, medical records, and financial statements are transmitted
              to third-party servers where you have no control over who accesses them.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">File size limits:</strong> Many
              tools cap uploads at 5-10MB, which is often smaller than a single high-resolution
              scanned page.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Wait times:</strong> Server-side
              processing means queuing behind other users, especially during peak hours.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Client-Side OCR: The Private Alternative
          </h2>
          <p>
            Modern web browsers can run OCR entirely on your device using JavaScript libraries
            like tesseract.js. This means your scanned documents never leave your computer.
            The processing happens in your browser&apos;s engine, and once you close the tab,
            all data is gone.
          </p>
          <p>
            <Link href="/pdf/ocr-pdf" className="text-[var(--color-primary)] hover:underline font-medium">
              Krynn Tools&apos; OCR PDF tool
            </Link>{" "}
            uses this approach. It combines tesseract.js for text recognition with pdf.js for
            rendering PDF pages to images — all running locally in your browser.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Step-by-Step: How to Extract Text from a Scanned PDF
          </h2>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong className="text-[var(--color-foreground)]">Open the tool:</strong> Navigate
                to{" "}
                <Link href="/pdf/ocr-pdf" className="text-[var(--color-primary)] hover:underline">
                  /pdf/ocr-pdf
                </Link>{" "}
                in your browser.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Upload your file:</strong> Drag
                and drop your scanned PDF or image, or click to browse. The tool accepts PDF,
                JPG, PNG, and WebP formats.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Select the language:</strong> Choose
                the document language from the dropdown. English is the default, but over 20
                languages are available.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Click &quot;Extract Text&quot;:</strong> The
                tool will render each PDF page to an image, then run OCR on each page. You
                will see a progress bar showing current page and percentage.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Copy or download:</strong> Once
                complete, the extracted text appears in a copyable text area. Use the
                &quot;Copy Text&quot; button or download as a .txt file.
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Tips for Better OCR Results
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-[var(--color-foreground)]">Use high-resolution scans:</strong> OCR
              works best at 300 DPI or higher. Low-resolution images produce more errors.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Select the correct language:</strong> Choosing
              the right language pack dramatically improves accuracy, especially for documents
              with special characters.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Ensure straight alignment:</strong> Skewed
              or rotated scans confuse OCR engines. Straighten your document before uploading
              if possible.
            </li>
            <li>
              <strong className="text-[var(--color-foreground)]">Clean scans work best:</strong> Documents
              with stains, creases, or low contrast produce more errors. Clean scans yield
              cleaner text.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Common Use Cases for PDF OCR
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Digitizing old printed books and archives</li>
            <li>Extracting text from contracts and legal documents</li>
            <li>Converting handwritten notes (with clear handwriting) to digital text</li>
            <li>Making academic papers searchable for research</li>
            <li>Processing receipts and invoices for expense tracking</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Conclusion
          </h2>
          <p>
            Extracting text from scanned PDFs does not require expensive software or
            privacy-compromising online services. With client-side OCR tools like{" "}
            <Link href="/pdf/ocr-pdf" className="text-[var(--color-primary)] hover:underline font-medium">
              Krynn Tools&apos; OCR PDF
            </Link>
            , you can convert any scanned document to editable text right in your browser —
            fast, free, and completely private.
          </p>
        </div>
      </article>
    </div>
  );
}
