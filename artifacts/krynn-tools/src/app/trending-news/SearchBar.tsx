import { useState, useEffect, useRef, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search articles..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted-foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] pl-12 pr-10 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/70 transition-all duration-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
      />

      {localValue && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-muted-foreground)] transition-colors duration-150 hover:text-[var(--color-foreground)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
