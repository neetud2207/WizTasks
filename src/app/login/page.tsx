'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthCard } from '@/components/AuthCard';
import { loginSchema } from '@/lib/validations';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Please check your details.');
      return;
    }

    setIsLoading(true);
    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    setIsLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    toast.success('Welcome back, Wizard.');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <AuthCard title="Enter Hogwarts" subtitle="Sign in to continue your magical studies.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-parchment/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
            placeholder="hermione@hogwarts.edu"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-parchment/80">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-burgundy/20 px-3 py-2 text-sm text-parchment-light">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 font-semibold text-midnight transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Casting entry charm…' : 'Enter Hogwarts'}
        </button>

        <p className="text-center text-sm text-parchment/60">
          New here?{' '}
          <Link href="/register" className="text-gold-light hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-parchment/40">
          Demo login: hermione@hogwarts.edu / WingardiumLev1osa!
        </p>
      </form>
    </AuthCard>
  );
}
