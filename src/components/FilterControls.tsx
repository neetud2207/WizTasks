'use client';

import type { TaskFilters } from '@/hooks/useTasks';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/utils';

const selectClass =
  'rounded-md border border-gold/20 bg-midnight-light px-3 py-2.5 text-sm text-parchment-light focus:border-gold/60';

export function FilterControls({
  filters,
  onChange,
}: {
  filters: TaskFilters;
  onChange: (patch: Partial<TaskFilters>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <label className="sr-only" htmlFor="filter-status">
        Filter by status
      </label>
      <select
        id="filter-status"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as TaskFilters['status'] })}
        className={selectClass}
      >
        <option value="ALL">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-priority">
        Filter by priority
      </label>
      <select
        id="filter-priority"
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value as TaskFilters['priority'] })}
        className={selectClass}
      >
        <option value="ALL">All priorities</option>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-category">
        Filter by subject
      </label>
      <select
        id="filter-category"
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value as TaskFilters['category'] })}
        className={selectClass}
      >
        <option value="ALL">All subjects</option>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-sort">
        Sort assignments
      </label>
      <select
        id="filter-sort"
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as TaskFilters['sort'] })}
        className={selectClass}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDate">By due date</option>
        <option value="priority">By priority</option>
      </select>
    </div>
  );
}
