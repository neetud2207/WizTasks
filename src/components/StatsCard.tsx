import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: 'gold' | 'emerald' | 'burgundy';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-light'
      : accent === 'burgundy'
        ? 'text-burgundy-light'
        : 'text-gold';

  return (
    <div className="parchment-card flex items-center justify-between p-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-parchment/45">{label}</p>
        <p className="mt-1.5 font-display text-3xl font-semibold text-parchment-light">{value}</p>
      </div>
      <div className={cn('rounded-full bg-white/5 p-3', accentClass)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
