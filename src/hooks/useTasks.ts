'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types';

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'ALL';
  priority: TaskPriority | 'ALL';
  category: TaskCategory | 'ALL';
  sort: 'newest' | 'oldest' | 'dueDate' | 'priority';
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  sort: 'newest',
};

export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status !== 'ALL') params.set('status', filters.status);
      if (filters.priority !== 'ALL') params.set('priority', filters.priority);
      if (filters.category !== 'ALL') params.set('category', filters.category);
      params.set('sort', filters.sort);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to load assignments.');
      }

      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.status, filters.priority, filters.category, filters.sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(payload: Partial<Task>) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? 'Something went wrong. Please try again.');
      return false;
    }
    toast.success('Assignment added to your parchment.');
    await fetchTasks();
    return true;
  }

  async function updateTask(id: string, payload: Partial<Task>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to update the assignment.');
      return false;
    }
    toast.success('Assignment successfully revised.');
    await fetchTasks();
    return true;
  }

  async function toggleComplete(task: Task) {
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to update the assignment.');
      return false;
    }
    if (nextStatus === 'COMPLETED') {
      toast.success('Assignment mastered! ✨');
    } else {
      toast.success('Assignment moved back to your queue.');
    }
    await fetchTasks();
    return true;
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to vanish the assignment.');
      return false;
    }
    toast.success('Assignment vanished from your ledger.');
    await fetchTasks();
    return true;
  }

  return { tasks, isLoading, error, refetch: fetchTasks, createTask, updateTask, toggleComplete, deleteTask };
}
