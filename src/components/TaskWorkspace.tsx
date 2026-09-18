'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks, DEFAULT_FILTERS } from '@/hooks/useTasks';
import type { Task } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import { FilterControls } from '@/components/FilterControls';
import { TaskList } from '@/components/TaskList';
import { TaskModal } from '@/components/TaskModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function TaskWorkspace({
  showControls = true,
  limit,
  title,
}: {
  showControls?: boolean;
  limit?: number;
  title?: string;
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { tasks, isLoading, error, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(filters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const visibleTasks = useMemo(
    () => (limit ? tasks.slice(0, limit) : tasks),
    [tasks, limit],
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.category !== 'ALL';

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleModalSubmit(payload: Partial<Task>) {
    if (editingTask) {
      return updateTask(editingTask.id, payload);
    }
    return createTask(payload);
  }

  async function handleConfirmDelete() {
    if (!taskPendingDelete) return;
    await deleteTask(taskPendingDelete.id);
    setTaskPendingDelete(null);
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-parchment-light">
          {title ?? 'Your Assignments'}
        </h2>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-midnight shadow-candle transition hover:bg-gold-light"
        >
          <Plus className="h-4 w-4" /> New Assignment
        </button>
      </div>

      {showControls && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={filters.search} onChange={(search) => setFilters({ ...filters, search })} />
          <FilterControls filters={filters} onChange={(patch) => setFilters({ ...filters, ...patch })} />
        </div>
      )}

      <TaskList
        tasks={visibleTasks}
        isLoading={isLoading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={setTaskPendingDelete}
        onToggleComplete={toggleComplete}
      />

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        open={taskPendingDelete !== null}
        onCancel={() => setTaskPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
