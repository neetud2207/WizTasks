import { ScrollText, AlertTriangle } from 'lucide-react';

export function EmptyState({
  title = 'The parchment awaits your first assignment.',
  body = 'No assignments found. The parchment is currently blank.',
  actionLabel,
  onAction,
}: {
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="parchment-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <ScrollText className="h-9 w-9 text-gold/60" aria-hidden="true" />
      <h3 className="font-display text-xl font-semibold text-parchment-light">{title}</h3>
      <p className="max-w-sm text-sm text-parchment/60">{body}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-gold-light"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }: { message?: string }) {
  return (
    <div className="parchment-card flex flex-col items-center gap-3 border-burgundy/40 px-6 py-14 text-center">
      <AlertTriangle className="h-9 w-9 text-burgundy-light" aria-hidden="true" />
      <p className="max-w-sm text-sm text-parchment/70">{message}</p>
    </div>
  );
}
