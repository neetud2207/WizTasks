'use client';

import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search assignments by title or description…"
        aria-label="Search assignments"
        className="w-full rounded-md border border-gold/20 bg-midnight-light py-2.5 pl-9 pr-3 text-sm text-parchment-light placeholder:text-parchment/35 focus:border-gold/60"
      />
    </div>
  );
}
