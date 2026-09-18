'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  open,
  title = 'Are you certain you wish to vanish this assignment?',
  body = 'This action cannot be undone.',
  confirmLabel = 'Vanish it',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  body?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
    >
      <div
        className="parchment-card glow-border w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertTriangle className="h-7 w-7 text-burgundy-light" aria-hidden="true" />
        <h2 id="confirm-dialog-title" className="mt-3 font-display text-xl font-semibold text-parchment-light">
          {title}
        </h2>
        <p className="mt-2 text-sm text-parchment/65">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-gold/20 px-4 py-2 text-sm text-parchment/75 transition hover:border-gold/50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="rounded-md bg-burgundy px-4 py-2 text-sm font-semibold text-parchment-light transition hover:bg-burgundy-light"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
