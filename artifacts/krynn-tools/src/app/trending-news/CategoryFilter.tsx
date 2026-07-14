interface CategoryFilterProps {
  categories: { name: string; count: number }[];
  active: string;
  onChange: (category: string) => void;
}

const categoryColors: Record<string, string> = {
  All: 'var(--color-primary)',
  Technology: '#3b82f6',
  AI: '#a855f7',
  Cybersecurity: '#ef4444',
  'Open Source': '#22c55e',
};

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map(({ name, count }) => {
        const isActive = active === name;
        const color = categoryColors[name] || 'var(--color-primary)';

        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              borderColor: isActive ? color : 'var(--color-border)',
              background: isActive ? color : 'var(--color-card)',
              color: isActive ? '#fff' : 'var(--color-muted-foreground)',
              boxShadow: isActive ? `0 2px 8px ${color}40` : 'none',
            }}
          >
            {name}
            <span
              className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
              style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-muted)',
                color: isActive ? '#fff' : 'var(--color-muted-foreground)',
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
