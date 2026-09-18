import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const OWNER_SESSION = { user: { id: 'user-1', name: 'Hermione', house: 'GRYFFINDOR' } };
const OTHER_SESSION = { user: { id: 'user-2', name: 'Draco', house: 'SLYTHERIN' } };

describe('Task API authentication', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests to list tasks', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { GET } = await import('@/app/api/tasks/route');
    const response = await GET(new Request('http://localhost/api/tasks'));
    expect(response.status).toBe(401);
  });

  it('rejects unauthenticated requests to create a task', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { POST } = await import('@/app/api/tasks/route');
    const response = await POST(
      new Request('http://localhost/api/tasks', { method: 'POST', body: JSON.stringify({}) }),
    );
    expect(response.status).toBe(401);
  });
});

describe('Task creation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('rejects a task with a title shorter than 2 characters', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OWNER_SESSION);

    const { POST } = await import('@/app/api/tasks/route');
    const response = await POST(
      new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'A' }),
      }),
    );
    expect(response.status).toBe(400);
  });

  it('creates a task scoped to the authenticated user, ignoring any client-supplied userId', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OWNER_SESSION);
    const { prisma } = await import('@/lib/prisma');
    (prisma.task.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'task-1' });

    const { POST } = await import('@/app/api/tasks/route');
    await POST(
      new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'Brew a potion', userId: 'someone-elses-id' }),
      }),
    );

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
    );
  });
});

describe('Task ownership enforcement on a single task', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 404 when a user tries to update someone else's task", async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OTHER_SESSION);
    const { prisma } = await import('@/lib/prisma');
    (prisma.task.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'task-1',
      userId: 'user-1', // belongs to Hermione, not Draco
    });

    const { PUT } = await import('@/app/api/tasks/[id]/route');
    const response = await PUT(
      new Request('http://localhost/api/tasks/task-1', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Hijacked title' }),
      }),
      { params: { id: 'task-1' } },
    );

    expect(response.status).toBe(404);
    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it("returns 404 when a user tries to delete someone else's task", async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OTHER_SESSION);
    const { prisma } = await import('@/lib/prisma');
    (prisma.task.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'task-1',
      userId: 'user-1',
    });

    const { DELETE } = await import('@/app/api/tasks/[id]/route');
    const response = await DELETE(new Request('http://localhost/api/tasks/task-1'), {
      params: { id: 'task-1' },
    });

    expect(response.status).toBe(404);
    expect(prisma.task.delete).not.toHaveBeenCalled();
  });

  it('allows the owner to update their own task', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OWNER_SESSION);
    const { prisma } = await import('@/lib/prisma');
    (prisma.task.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'task-1',
      userId: 'user-1',
    });
    (prisma.task.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'task-1',
      status: 'COMPLETED',
    });

    const { PATCH } = await import('@/app/api/tasks/[id]/route');
    const response = await PATCH(
      new Request('http://localhost/api/tasks/task-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'COMPLETED' }),
      }),
      { params: { id: 'task-1' } },
    );

    expect(response.status).toBe(200);
    expect(prisma.task.update).toHaveBeenCalled();
  });

  it('returns 404 for a task that does not exist', async () => {
    const { getServerSession } = await import('next-auth');
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(OWNER_SESSION);
    const { prisma } = await import('@/lib/prisma');
    (prisma.task.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { GET } = await import('@/app/api/tasks/[id]/route');
    const response = await GET(new Request('http://localhost/api/tasks/does-not-exist'), {
      params: { id: 'does-not-exist' },
    });

    expect(response.status).toBe(404);
  });
});
