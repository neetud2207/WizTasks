'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ScrollText, UserCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Hall', icon: LayoutGrid },
  { href: '/assignments', label: 'Tasks', icon: ScrollText },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-gold/15 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
    >
      {NAV_ITEMS.map((navItem) => {
        const active = pathname === navItem.href;
        return (
          <Link
            key={navItem.href}
            href={navItem.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-w-[64px] flex-col items-center gap-1 px-2 py-2.5 text-xs transition',
              active ? 'text-gold-light' : 'text-parchment/55',
            )}
          >
            <navItem.icon className="h-5 w-5" aria-hidden="true" />
            {navItem.label}
          </Link>
        );
      })}
    </nav>
  );
}
