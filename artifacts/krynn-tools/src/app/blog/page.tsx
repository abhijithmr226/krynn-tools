import { Link } from "wouter";
import BlogAd from "./BlogAd";
import { blogPosts } from "@/lib/blog-data";

// Re-export for any legacy imports
export { blogPosts } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <div className="container-app py-12">
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
                width={400}
                height={170}
                loading="lazy"
                decoding="async"
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
