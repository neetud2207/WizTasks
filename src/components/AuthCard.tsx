import Link from 'next/link';
import { MagicalBackground } from '@/components/MagicalBackground';

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12 text-parchment sm:px-6">
      <MagicalBackground />
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-block font-display text-xl font-semibold text-gold-light"
        >
          Hogwarts Task Ledger
        </Link>
        <div className="parchment-card glow-border p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold text-parchment-light">{title}</h1>
          <p className="mt-1.5 text-sm text-parchment/65">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
