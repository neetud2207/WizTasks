import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ScrollText, Hourglass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/StatsCard';
import { ProgressCard } from '@/components/ProgressCard';
import { TaskWorkspace } from '@/components/TaskWorkspace';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'PENDING' } }),
    prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Assignments" value={total} icon={ScrollText} />
        <StatsCard label="Pending" value={pending} icon={Hourglass} accent="burgundy" />
        <StatsCard label="In Progress" value={inProgress} icon={Sparkles} accent="gold" />
        <StatsCard label="Completed" value={completed} icon={CheckCircle2} accent="emerald" />
      </div>

      <ProgressCard percentage={completionPercentage} />

      <div>
        <TaskWorkspace showControls={false} limit={6} title="Recent Assignments" />
        <div className="mt-4 text-right">
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1.5 text-sm text-gold-light hover:underline"
          >
            View all assignments <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
