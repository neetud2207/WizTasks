export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'No date set';
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(date: Date | string | null | undefined, status: string): boolean {
  if (!date || status === 'COMPLETED') return false;
  return new Date(date).getTime() < Date.now();
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'In Progress Queue',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Mastered',
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Minor',
  MEDIUM: 'Notable',
  HIGH: 'Urgent',
};

export const CATEGORY_LABELS: Record<string, string> = {
  POTIONS: 'Potions',
  CHARMS: 'Charms',
  DEFENSE: 'Defense Against the Dark Arts',
  TRANSFIGURATION: 'Transfiguration',
  HERBOLOGY: 'Herbology',
  ASTRONOMY: 'Astronomy',
  OTHER: 'Other Studies',
};

export const HOUSE_LABELS: Record<string, string> = {
  GRYFFINDOR: 'Gryffindor',
  SLYTHERIN: 'Slytherin',
  RAVENCLAW: 'Ravenclaw',
  HUFFLEPUFF: 'Hufflepuff',
  UNSORTED: 'Unsorted',
};
