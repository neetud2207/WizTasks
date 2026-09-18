import { describe, expect, it, vi, beforeEach } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validations';

describe('registerSchema', () => {
  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse({
      name: 'Hermione Granger',
      email: 'hermione@hogwarts.edu',
      password: 'WingardiumLev1osa!',
      confirmPassword: 'WingardiumLev1osa!',
      house: 'GRYFFINDOR',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Hermione Granger',
      email: 'hermione@hogwarts.edu',
      password: 'WingardiumLev1osa!',
      confirmPassword: 'SomethingElse1!',
      house: 'GRYFFINDOR',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password without an uppercase letter', () => {
    const result = registerSchema.safeParse({
      name: 'Hermione Granger',
      email: 'hermione@hogwarts.edu',
      password: 'lowercase1',
      confirmPassword: 'lowercase1',
      house: 'GRYFFINDOR',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Hermione Granger',
      email: 'not-an-email',
      password: 'WingardiumLev1osa!',
      confirmPassword: 'WingardiumLev1osa!',
      house: 'GRYFFINDOR',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires an email and non-empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });
});

// --- Registration route: duplicate-email handling ---
// Mock Prisma and bcrypt so the route can be exercised without a real database.
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns 409 when the email is already registered', async () => {
    const { prisma } = await import('@/lib/prisma');
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'existing-user' });

    const { POST } = await import('@/app/api/auth/register/route');
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Harry Potter',
        email: 'harry@hogwarts.edu',
        password: 'ExpectoPatr0num!',
        confirmPassword: 'ExpectoPatr0num!',
        house: 'GRYFFINDOR',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(409);
  });

  it('returns 400 for invalid input before touching the database', async () => {
    const { prisma } = await import('@/lib/prisma');
    const { POST } = await import('@/app/api/auth/register/route');

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'H', email: 'not-an-email', password: '123', confirmPassword: '123' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
