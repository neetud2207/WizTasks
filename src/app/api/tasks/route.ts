import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/lib/validations';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') ?? 'newest';

  const where: Prisma.TaskWhereInput = {
    userId: session.user.id,
    ...(status && status !== 'ALL' ? { status: status as Prisma.EnumTaskStatusFilter['equals'] } : {}),
    ...(priority && priority !== 'ALL'
      ? { priority: priority as Prisma.EnumTaskPriorityFilter['equals'] }
      : {}),
    ...(category && category !== 'ALL'
      ? { category: category as Prisma.EnumTaskCategoryFilter['equals'] }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput =
    sort === 'oldest'
      ? { createdAt: 'asc' }
      : sort === 'dueDate'
        ? { dueDate: 'asc' }
        : sort === 'priority'
          ? { priority: 'desc' }
          : { createdAt: 'desc' };

  try {
    const tasks = await prisma.task.findMany({ where, orderBy });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to load assignments.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Invalid task data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, description, status, priority, category, dueDate } = parsed.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create the assignment.' }, { status: 500 });
  }
}
