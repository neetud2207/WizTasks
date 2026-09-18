'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthCard } from '@/components/AuthCard';
import { HouseSelector } from '@/components/HouseSelector';
import { registerSchema } from '@/lib/validations';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    house: 'UNSORTED',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Please check your details.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      setIsLoading(false);

      if (signInResult?.error) {
        toast.success('Account created — please sign in.');
        router.push('/login');
        return;
      }

      toast.success('Assignment added to your parchment. Welcome to Hogwarts!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <AuthCard title="Create Your Account" subtitle="Enroll and begin your magical ledger.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-parchment/80">
            Name
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
            placeholder="Hermione Granger"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-parchment/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
            placeholder="hermione@hogwarts.edu"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-parchment/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm text-parchment/80">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light placeholder:text-parchment/30 focus:border-gold/60"
              placeholder="••••••••"
            />
          </div>
        </div>
        <p className="text-xs text-parchment/45">
          At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
        </p>

        <HouseSelector value={form.house} onChange={(house) => setForm({ ...form, house })} />

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
          {isLoading ? 'Sorting you now…' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-parchment/60">
          Already enrolled?{' '}
          <Link href="/login" className="text-gold-light hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
