import { Metadata } from "next";
import Link from "next/link";
import BlogAd from "./BlogAd";

export const metadata: Metadata = {
  title: "Blog & Tutorials",
  description: "Tips, guides, and tutorials for using free online tools. Learn about PDF compression, image optimization, JSON formatting, and more.",
  keywords: ["online tools blog", "PDF tips", "image compression guide", "developer tools", "free online utilities"],
  alternates: { canonical: "https://krynntools.online/blog" },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    description: "Learn how to compress PDF files without losing quality. Free client-side tool for fast, secure PDF optimization.",
    date: "January 15, 2026",
    category: "PDF",
    readingTime: "7 min",
    image: "/images/blog/compress-pdf.svg",
  },
  {
    slug: "how-to-merge-multiple-pdfs",
    title: "How to Merge Multiple PDFs Into One File for Free",
    description: "Learn how to merge multiple PDF files into a single document for free. Client-side processing keeps your files private.",
    date: "January 20, 2026",
    category: "PDF",
    readingTime: "6 min",
    image: "/images/blog/merge-pdf.svg",
  },
  {
    slug: "10-signs-your-password-isnt-strong-enough",
    title: "10 Signs Your Password Isn't Strong Enough",
    description: "Is your password really protecting you? Learn 10 warning signs that your passwords need an upgrade.",
    date: "January 25, 2026",
    category: "Security",
    readingTime: "8 min",
    image: "/images/blog/password-generator.svg",
  },
  {
    slug: "qr-codes-explained-static-vs-dynamic",
    title: "QR Codes Explained: Static vs Dynamic",
    description: "Understand the difference between static and dynamic QR codes, when to use each, and how to generate them for free.",
    date: "January 30, 2026",
    category: "Security",
    readingTime: "6 min",
    image: "/images/blog/qr-code-generator.svg",
  },
  {
    slug: "how-to-shrink-image-file-size",
    title: "How to Shrink Image File Size Without Losing Quality",
    description: "Learn how to shrink image file sizes for web, email, and social media without losing visible quality.",
    date: "February 1, 2026",
    category: "Image",
    readingTime: "7 min",
    image: "/images/blog/compress-image.svg",
  },
  {
    slug: "how-to-remove-background-from-photo",
    title: "How to Remove a Background From a Photo in 10 Seconds",
    description: "Remove photo backgrounds instantly with a free browser-based tool. No software install, no upload required.",
    date: "February 5, 2026",
    category: "Image",
    readingTime: "5 min",
    image: "/images/blog/remove-background.svg",
  },
  {
    slug: "json-formatting-best-practices",
    title: "JSON Formatting Best Practices for Developers",
    description: "Master JSON formatting with best practices for indentation, naming, validation, and tooling.",
    date: "February 10, 2026",
    category: "Developer",
    readingTime: "8 min",
    image: "/images/blog/json-formatter.svg",
  },
  {
    slug: "what-is-base64-encoding",
    title: "What Is Base64 Encoding and When Do You Need It?",
    description: "Understand Base64 encoding, how it works, and when you actually need to use it. Practical examples for developers.",
    date: "February 15, 2026",
    category: "Developer",
    readingTime: "7 min",
    image: "/images/blog/base64-encoder.svg",
  },
  {
    slug: "bmi-explained-what-numbers-mean",
    title: "BMI Explained: What the Numbers Actually Mean",
    description: "Understand BMI categories, how to calculate yours, and what the numbers really tell you about your health.",
    date: "February 20, 2026",
    category: "Health",
    readingTime: "6 min",
    image: "/images/blog/bmi-calculator.svg",
  },
  {
    slug: "how-emi-is-calculated-on-loan",
    title: "How EMI Is Calculated on a Loan (With Formula)",
    description: "Understand how loan EMI is calculated with the reducing balance formula. Includes examples and a free calculator.",
    date: "February 25, 2026",
    category: "Finance",
    readingTime: "8 min",
    image: "/images/blog/loan-emi-calculator.svg",
  },
  {
    slug: "how-to-extract-text-from-scanned-pdfs",
    title: "How to Extract Text from Scanned PDFs",
    description: "Learn how to extract text from scanned PDFs using free client-side OCR. Step-by-step guide with privacy-first processing.",
    date: "July 12, 2026",
    category: "PDF",
    readingTime: "6 min",
    image: "/images/blog/compress-pdf.svg",
  },
  {
    slug: "best-free-dice-roller-for-board-games",
    title: "Best Free Dice Roller for Board Games",
    description: "Find the best free online dice roller for board games and tabletop RPGs. Roll D4, D6, D8, D10, D12, D20 with realistic animations.",
    date: "July 12, 2026",
    category: "Misc",
    readingTime: "5 min",
    image: "/images/blog/base64-encoder.svg",
  },
  {
    slug: "how-to-crop-passport-size-photos-online",
    title: "How to Crop Passport Size Photos Online",
    description: "Learn how to crop passport size photos online for free. Includes US, UK, India, and other country-specific photo dimensions.",
    date: "July 12, 2026",
    category: "Image",
    readingTime: "6 min",
    image: "/images/blog/compress-image.svg",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-[var(--color-foreground)]">
          Blog &amp; Tutorials
        </h1>
        <p className="text-lg text-[var(--color-muted-foreground)]">
          Tips, guides, and tutorials for getting the most out of free online tools.
        </p>
      </div>

      <BlogAd />

      <div className="grid gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-lg"
          >
            {/* Visual Thumbnail Card using project screenshots */}
            <div style={{
              position: "relative",
              height: "170px",
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              marginBottom: "16px",
              border: "1px solid var(--color-border)",
              background: "var(--color-muted)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 250ms ease",
                }}
                className="group-hover:scale-[1.03]"
              />
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
                {post.category}
              </span>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {post.readingTime} read
              </span>
            </div>
            
            <h2 className="mb-2 text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
              {post.title}
            </h2>
            
            <p className="mb-4 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
              {post.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {post.date}
              </span>
              <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                Read more →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
