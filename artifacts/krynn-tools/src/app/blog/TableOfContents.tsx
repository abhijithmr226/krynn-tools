import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, [contentRef]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-left md:hidden"
      >
        <span className="text-sm font-bold text-[var(--color-foreground)]">Table of Contents</span>
        <svg
          className={`w-4 h-4 text-[var(--color-muted-foreground)] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <nav
        className={`mt-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] ${
          isOpen ? "block" : "hidden"
        } md:block`}
        aria-label="Table of contents"
      >
        <h2 className="text-sm font-bold mb-3 text-[var(--color-foreground)]">Table of Contents</h2>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id} style={{ paddingLeft: `${(level - 2) * 16}px` }}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(id);
                }}
                className={`text-xs block py-1 transition-colors ${
                  activeId === id
                    ? "text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
