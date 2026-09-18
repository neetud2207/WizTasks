import type { DefaultSession } from 'next-auth';

export type House = 'GRYFFINDOR' | 'SLYTHERIN' | 'RAVENCLAW' | 'HUFFLEPUFF' | 'UNSORTED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskCategory =
  | 'POTIONS'
  | 'CHARMS'
  | 'DEFENSE'
  | 'TRANSFIGURATION'
  | 'HERBOLOGY'
  | 'ASTRONOMY'
  | 'OTHER';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  house: House;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      house: House;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    house: House;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    house: House;
  }
}
