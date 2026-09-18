import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileCard } from '@/components/ProfileCard';
import type { ProfileData } from '@/types';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, name: true, email: true, house: true, createdAt: true },
  });

  const [totalTasks, completedTasks] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  const profile: ProfileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    house: user.house,
    createdAt: user.createdAt.toISOString(),
    totalTasks,
    completedTasks,
    completionPercentage: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-parchment-light">Wizard Profile</h1>
      <ProfileCard profile={profile} />
    </div>
  );
}
