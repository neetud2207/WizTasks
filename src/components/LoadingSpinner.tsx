import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading your ledger…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-parchment/60">
      <Loader2 className="h-7 w-7 animate-spin text-gold" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
