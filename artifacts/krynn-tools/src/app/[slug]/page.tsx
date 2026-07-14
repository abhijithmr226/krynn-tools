import { useParams } from "wouter";
import { Link } from "wouter";
import { categories, getToolsByCategory } from "@/lib/tools";
import CategoryClient from "./CategoryClient";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <Link href="/" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

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
