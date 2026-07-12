import Link from "next/link";
import { categories, getToolsByCategory } from "@/lib/tools";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find(c => c.slug === slug);
  const catTools = getToolsByCategory(slug);

  if (!cat) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <Link href="/" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl text-[var(--color-foreground)]">{cat.name}</h1>
        <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">{cat.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${cat.slug}/${tool.slug}`}
            className="tool-card group"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: cat.color + "15" }}>
              <svg className="h-6 w-6" style={{ color: cat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="mb-2 font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
              {tool.name}
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-center text-[var(--color-foreground)]">
          All Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.filter(c => c.slug !== slug).map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 hover:border-[var(--color-primary)] transition-colors duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: c.color + "15" }}>
                <svg className="h-5 w-5" style={{ color: c.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-[var(--color-foreground)]">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
