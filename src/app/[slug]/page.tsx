import { Metadata } from "next";
import Link from "next/link";
import { categories, getToolsByCategory } from "@/lib/tools";
import KrynnIcon from "@/components/KrynnIcon";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const cat = categories.find(c => c.slug === slug);
    const url = `https://www.krynntools.online/${slug}`;
    return {
      title: `${cat?.name || slug} – Free Online Tools`,
      description: cat?.description || `Free online ${cat?.name} tools. Process files in your browser.`,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        locale: "en_US",
        url,
        siteName: "Krynn Tools",
        title: `${cat?.name || slug} – Free Online Tools`,
        description: cat?.description || `Free online ${cat?.name} tools.`,
        images: [{ url: "https://www.krynntools.online/logo.png", width: 1200, height: 630, alt: `${cat?.name} – Krynn Tools` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${cat?.name || slug} – Free Online Tools`,
        description: cat?.description || `Free online ${cat?.name} tools.`,
        images: ["https://www.krynntools.online/logo.png"],
      },
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find(c => c.slug === slug);
  const catTools = getToolsByCategory(slug);

  if (!cat) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <Link href="/" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
          ← Back to Home
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
              <KrynnIcon name={tool.icon} size={24} weight="duotone" color={cat.color} />
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
                <KrynnIcon name={c.icon} size={20} weight="duotone" color={c.color} />
              </div>
              <span className="font-semibold text-sm text-[var(--color-foreground)]">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
