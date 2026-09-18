'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ScrollText, UserCircle, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Great Hall', icon: LayoutGrid },
  { href: '/assignments', label: 'Assignments', icon: ScrollText },
  { href: '/profile', label: 'Wizard Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gold/10 bg-charcoal/80 backdrop-blur-sm lg:flex">
      <div className="px-6 py-6">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-gold-light">
          Hogwarts Task Ledger
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {NAV_ITEMS.map((navItem) => {
          const active = pathname === navItem.href;
          return (
            <Link
              key={navItem.href}
              href={navItem.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition',
                active
                  ? 'bg-gold/10 text-gold-light'
                  : 'text-parchment/65 hover:bg-white/5 hover:text-parchment-light',
              )}
            >
              <navItem.icon className="h-4 w-4" aria-hidden="true" />
              {navItem.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gold/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-parchment/65 transition hover:bg-burgundy/20 hover:text-parchment-light"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
