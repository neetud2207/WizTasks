import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { taskUpdateSchema } from '@/lib/validations';

interface RouteParams {
  params: { id: string };
}

/**
 * Loads a task and confirms it belongs to the current session's user.
 * Never trust a client-supplied ID: this check runs on every mutation.
 */
async function getOwnedTask(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) {
    return null;
  }
  return task;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const task = await getOwnedTask(params.id, session.user.id);
  if (!task) {
    return NextResponse.json({ error: 'That assignment could not be found.' }, { status: 404 });
  }

  return NextResponse.json({ task });
}

async function updateTask(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const existing = await getOwnedTask(params.id, session.user.id);
  if (!existing) {
    return NextResponse.json(
      { error: 'That assignment could not be found, or is not yours to edit.' },
      { status: 404 },
    );
  }

  try {
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Invalid task data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, description, status, priority, category, dueDate } = parsed.data;

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description: description || null } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update the assignment.' }, { status: 500 });
  }
}

export const PUT = updateTask;
export const PATCH = updateTask;

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const existing = await getOwnedTask(params.id, session.user.id);
  if (!existing) {
    return NextResponse.json(
      { error: 'That assignment could not be found, or is not yours to vanish.' },
      { status: 404 },
    );
  }

  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to vanish the assignment.' }, { status: 500 });
  }
}
