'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, CalendarClock, AlertOctagon } from 'lucide-react';
import type { Task } from '@/types';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS, formatDate, isOverdue, cn } from '@/lib/utils';

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'border-emerald/40 text-emerald-light',
  MEDIUM: 'border-gold/40 text-gold-light',
  HIGH: 'border-burgundy/50 text-burgundy-light',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-white/5 text-parchment/70',
  IN_PROGRESS: 'bg-gold/10 text-gold-light',
  COMPLETED: 'bg-emerald/15 text-emerald-light',
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}) {
  const [justCompleted, setJustCompleted] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  function handleToggle() {
    if (task.status !== 'COMPLETED') {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 650);
    }
    onToggleComplete(task);
  }

  return (
    <li
      className={cn(
        'parchment-card flex flex-col gap-3 p-5 transition',
        justCompleted && 'animate-spell-pop',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gold/70">
            {CATEGORY_LABELS[task.category]}
          </p>
          <h3
            className={cn(
              'mt-1 break-words font-display text-lg font-semibold text-parchment-light',
              task.status === 'COMPLETED' && 'line-through decoration-gold/50 opacity-70',
            )}
          >
            {task.title}
          </h3>
        </div>
        <button
          onClick={handleToggle}
          aria-pressed={task.status === 'COMPLETED'}
          aria-label={task.status === 'COMPLETED' ? 'Mark as not completed' : 'Mark as mastered'}
          className="shrink-0 text-gold transition hover:scale-110"
        >
          {task.status === 'COMPLETED' ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <Circle className="h-7 w-7 text-parchment/30" />
          )}
        </button>
      </div>

      {task.description && (
        <p className="line-clamp-3 text-sm leading-relaxed text-parchment/65">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={cn('rounded-full border px-2.5 py-1 font-medium', PRIORITY_STYLES[task.priority])}>
          {PRIORITY_LABELS[task.priority]} priority
        </span>
        <span className={cn('rounded-full px-2.5 py-1 font-medium', STATUS_STYLES[task.status])}>
          {STATUS_LABELS[task.status]}
        </span>
        {task.dueDate && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium',
              overdue ? 'bg-burgundy/20 text-burgundy-light' : 'bg-white/5 text-parchment/60',
            )}
          >
            {overdue ? <AlertOctagon className="h-3.5 w-3.5" /> : <CalendarClock className="h-3.5 w-3.5" />}
            {overdue ? 'Overdue — ' : 'Due '}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center gap-2 border-t border-gold/10 pt-3">
        <button
          onClick={() => onEdit(task)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-parchment/70 transition hover:bg-white/5 hover:text-gold-light"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-parchment/70 transition hover:bg-burgundy/15 hover:text-burgundy-light"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </li>
  );
}
