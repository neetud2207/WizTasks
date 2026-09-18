'use client';

import { cn } from '@/lib/utils';

const HOUSES = [
  { value: 'GRYFFINDOR', label: 'Gryffindor', color: 'bg-house-gryffindor' },
  { value: 'SLYTHERIN', label: 'Slytherin', color: 'bg-house-slytherin' },
  { value: 'RAVENCLAW', label: 'Ravenclaw', color: 'bg-house-ravenclaw' },
  { value: 'HUFFLEPUFF', label: 'Hufflepuff', color: 'bg-house-hufflepuff' },
] as const;

export function HouseSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm text-parchment/80">Choose your house (optional)</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {HOUSES.map((house) => (
          <button
            key={house.value}
            type="button"
            onClick={() => onChange(value === house.value ? 'UNSORTED' : house.value)}
            aria-pressed={value === house.value}
            className={cn(
              'rounded-md border px-2 py-2.5 text-xs font-medium transition',
              value === house.value
                ? 'border-gold text-parchment-light'
                : 'border-gold/20 text-parchment/60 hover:border-gold/40',
            )}
          >
            <span className={cn('mx-auto mb-1.5 block h-2.5 w-2.5 rounded-full', house.color)} />
            {house.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
