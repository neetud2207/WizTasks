import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72)
      .regex(/[a-z]/, 'Password needs at least one lowercase letter')
      .regex(/[A-Z]/, 'Password needs at least one uppercase letter')
      .regex(/[0-9]/, 'Password needs at least one number'),
    confirmPassword: z.string(),
    house: z.enum(['GRYFFINDOR', 'SLYTHERIN', 'RAVENCLAW', 'HUFFLEPUFF', 'UNSORTED']).default(
      'UNSORTED',
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const taskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  category: z
    .enum(['POTIONS', 'CHARMS', 'DEFENSE', 'TRANSFIGURATION', 'HERBOLOGY', 'ASTRONOMY', 'OTHER'])
    .default('OTHER'),
  dueDate: z.string().datetime().optional().or(z.literal('')).or(z.null()),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const taskUpdateSchema = taskSchema.partial();

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80).optional(),
  house: z
    .enum(['GRYFFINDOR', 'SLYTHERIN', 'RAVENCLAW', 'HUFFLEPUFF', 'UNSORTED'])
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
