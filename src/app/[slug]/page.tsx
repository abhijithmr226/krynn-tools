import { Metadata } from "next";
import Link from "next/link";
import { categories, getToolsByCategory } from "@/lib/tools";
import CategoryClient from "./CategoryClient";

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

  return <CategoryClient cat={cat} catTools={catTools} currentSlug={slug} />;
}
