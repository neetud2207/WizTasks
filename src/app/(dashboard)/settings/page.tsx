'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Moon } from 'lucide-react';
import { toast } from 'sonner';

const REDUCED_MOTION_KEY = 'hogwarts-task-ledger:reduced-motion';

export default function SettingsPage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(REDUCED_MOTION_KEY);
      setReducedMotion(stored === 'true');
    } catch {
      // localStorage unavailable — fall back to default (motion enabled)
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.classList.toggle('force-reduced-motion', reducedMotion);
    try {
      window.localStorage.setItem(REDUCED_MOTION_KEY, String(reducedMotion));
    } catch {
      // ignore write failures (e.g. private browsing)
    }
  }, [reducedMotion, loaded]);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-parchment-light">Settings</h1>

      <section className="parchment-card p-6">
        <h2 className="font-display text-lg font-semibold text-parchment-light">Accessibility</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Moon className="mt-0.5 h-5 w-5 text-gold" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-parchment-light">Reduce motion</p>
              <p className="text-xs text-parchment/55">
                Turns off the drifting dust and page-load animations across the ledger.
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              reducedMotion ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-midnight-light transition-transform ${
                reducedMotion ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="parchment-card p-6">
        <h2 className="font-display text-lg font-semibold text-parchment-light">Account</h2>
        <p className="mt-2 text-sm text-parchment/60">
          Update your name and house from your{' '}
          <a href="/profile" className="text-gold-light hover:underline">
            Wizard Profile
          </a>
          .
        </p>
        <button
          onClick={() => {
            toast.success('Signing you out…');
            signOut({ callbackUrl: '/' });
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-burgundy/40 px-4 py-2.5 text-sm text-parchment-light transition hover:bg-burgundy/15"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </div>
  );
}
