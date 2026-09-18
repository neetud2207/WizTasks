'use client';

import type { Task } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/EmptyState';

export function TaskList({
  tasks,
  isLoading,
  error,
  hasActiveFilters,
  onCreate,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  if (tasks.length === 0) {
    return hasActiveFilters ? (
      <EmptyState
        title="No assignments match your search."
        body="Try adjusting your filters or search terms."
      />
    ) : (
      <EmptyState
        title="The parchment awaits your first assignment."
        body="No assignments found. The parchment is currently blank."
        actionLabel="+ New Assignment"
        onAction={onCreate}
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}
