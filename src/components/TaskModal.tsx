'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Task } from '@/types';
import { taskSchema } from '@/lib/validations';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/utils';

type FormState = {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  category: Task['category'];
  dueDate: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  category: 'OTHER',
  dueDate: '',
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}

export function TaskModal({
  open,
  task,
  onClose,
  onSubmit,
}: {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (payload: Partial<Task>) => Promise<boolean>;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setForm(
        task
          ? {
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              priority: task.priority,
              category: task.category,
              dueDate: toDateInputValue(task.dueDate),
            }
          : EMPTY_FORM,
      );
    }
  }, [open, task]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const dueDateIso = form.dueDate ? new Date(`${form.dueDate}T12:00:00.000Z`).toISOString() : '';
    const parsed = taskSchema.safeParse({ ...form, dueDate: dueDateIso });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Please check your details.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(parsed.data as Partial<Task>);
    setIsSubmitting(false);
    if (success) onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="parchment-card glow-border max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-b-xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 id="task-modal-title" className="font-display text-2xl font-semibold text-parchment-light">
            {task ? 'Revise Assignment' : 'New Assignment'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-parchment/50 transition hover:bg-white/5 hover:text-parchment-light"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm text-parchment/80">
              Title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
              placeholder="Complete Potion Essay"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm text-parchment/80">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
              placeholder="Eighteen inches on the properties of moonstone…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm text-parchment/80">
                Subject
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Task['category'] })}
                className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light focus:border-gold/60"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="mb-1.5 block text-sm text-parchment/80">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light focus:border-gold/60"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm text-parchment/80">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
                className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light focus:border-gold/60"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="mb-1.5 block text-sm text-parchment/80">
                Due date
              </label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light focus:border-gold/60"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-burgundy/20 px-3 py-2 text-sm text-parchment-light">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gold/20 px-4 py-2 text-sm text-parchment/75 transition hover:border-gold/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-gold-light disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {task ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
