import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li>
          <Link
            href="/"
            className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="text-[var(--color-muted-foreground)]"> / </span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--color-foreground)] font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
