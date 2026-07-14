import { Link } from "wouter";

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
}

const ALL_POSTS: RelatedPost[] = [
  { slug: "best-free-online-tools-2026", title: "Best Free Online Tools 2026", category: "Guide" },
  { slug: "free-grammarly-alternative-offline", title: "Free Grammarly Alternative", category: "AI Writing" },
  { slug: "smallpdf-vs-ilovepdf-vs-krynn-tools", title: "Smallpdf vs iLovePDF vs Krynn Tools", category: "PDF" },
  { slug: "remove-background-image-free-2026", title: "Remove Background Free", category: "Image" },
  { slug: "best-free-image-upscaler-2026", title: "Best Free Image Upscaler", category: "Image" },
  { slug: "best-free-qr-code-generator-2026", title: "Best Free QR Code Generator", category: "Security" },
  { slug: "convert-png-to-jpg-free", title: "Convert PNG to JPG Free", category: "Image" },
  { slug: "best-free-resume-builder-2026", title: "Best Free Resume Builder", category: "Career" },
  { slug: "how-to-compress-pdf-without-losing-quality", title: "How to Compress PDF", category: "PDF" },
  { slug: "how-to-merge-multiple-pdfs", title: "How to Merge PDFs", category: "PDF" },
  { slug: "10-signs-your-password-isnt-strong-enough", title: "Password Strength Signs", category: "Security" },
  { slug: "qr-codes-explained-static-vs-dynamic", title: "QR Codes Explained", category: "Security" },
  { slug: "how-to-shrink-image-file-size", title: "Shrink Image File Size", category: "Image" },
  { slug: "how-to-remove-background-from-photo", title: "Remove Background From Photo", category: "Image" },
  { slug: "json-formatting-best-practices", title: "JSON Formatting Best Practices", category: "Developer" },
  { slug: "what-is-base64-encoding", title: "What Is Base64 Encoding", category: "Developer" },
  { slug: "bmi-explained-what-numbers-mean", title: "BMI Explained", category: "Health" },
  { slug: "how-emi-is-calculated-on-loan", title: "How EMI Is Calculated", category: "Finance" },
  { slug: "how-to-extract-text-from-scanned-pdfs", title: "Extract Text From Scanned PDFs", category: "PDF" },
  { slug: "how-to-crop-passport-size-photos-online", title: "Crop Passport Size Photos", category: "Image" },
  { slug: "how-to-generate-strong-passwords-online", title: "Generate Strong Passwords", category: "Security" },
  { slug: "how-to-convert-text-case-online", title: "Convert Text Case Online", category: "Text" },
  { slug: "how-to-resize-images-for-social-media", title: "Resize Images For Social Media", category: "Social Media" },
  { slug: "what-is-a-uuid-and-how-to-generate-one", title: "What Is a UUID", category: "Developer" },
  { slug: "how-to-calculate-percentage-online", title: "Calculate Percentage Online", category: "Calculators" },
  { slug: "how-to-convert-units-online", title: "Convert Units Online", category: "Calculators" },
  { slug: "how-to-checksum-a-file", title: "Checksum a File", category: "Misc" },
  { slug: "how-to-count-words-and-characters-online", title: "Count Words and Characters", category: "Text" },
];

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
}

export default function RelatedPosts({ currentSlug, currentCategory }: RelatedPostsProps) {
  const related = ALL_POSTS
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      if (a.category === currentCategory && b.category !== currentCategory) return -1;
      if (a.category !== currentCategory && b.category === currentCategory) return 1;
      return 0;
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
      <h3 className="text-xl font-bold mb-6 text-[var(--color-foreground)]">Related Articles</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-200"
          >
            <span className="text-xs font-medium text-[var(--color-primary)] mb-2 block">
              {post.category}
            </span>
            <h4 className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
