import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileUpdateSchema } from '@/lib/validations';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      house: true,
      createdAt: true,
      _count: { select: { tasks: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Wizard record not found.' }, { status: 404 });
  }

  const completedTasks = await prisma.task.count({
    where: { userId: session.user.id, status: 'COMPLETED' },
  });

  const totalTasks = user._count.tasks;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return NextResponse.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      house: user.house,
      createdAt: user.createdAt,
      totalTasks,
      completedTasks,
      completionPercentage,
    },
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Invalid profile data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: { id: true, name: true, email: true, house: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update your wizard profile.' }, { status: 500 });
  }
}
