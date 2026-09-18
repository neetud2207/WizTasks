import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MagicalBackground } from '@/components/MagicalBackground';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Navbar } from '@/components/Navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen text-parchment">
      <MagicalBackground />
      <Sidebar />
      <div className="lg:pl-64">
        <Navbar name={session.user.name ?? 'Wizard'} house={session.user.house} />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
