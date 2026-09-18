'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function Navbar({ name, house }: { name: string; house: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/10 bg-midnight/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-parchment/40">Welcome back</p>
        <h1 className="font-display text-xl font-semibold text-parchment-light sm:text-2xl">
          {name}, Wizard
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold-light"
          title={`House: ${house}`}
        >
          {initial}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="hidden items-center gap-2 rounded-md border border-gold/20 px-3 py-2 text-sm text-parchment/70 transition hover:border-burgundy hover:text-parchment-light sm:flex"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </header>
  );
}
