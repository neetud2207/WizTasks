'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ProfileData } from '@/types';
import { HouseSelector } from '@/components/HouseSelector';
import { HOUSE_LABELS, formatDate } from '@/lib/utils';

export function ProfileCard({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [house, setHouse] = useState(profile.house);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = name.trim() !== profile.name || house !== profile.house;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setError(null);
    setIsSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), house }),
    });
    setIsSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Failed to update your profile.');
      return;
    }

    toast.success('Your wizard profile has been updated.');
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="parchment-card p-6 lg:col-span-1">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-3xl text-gold-light"
          aria-hidden="true"
        >
          {profile.name.trim().charAt(0).toUpperCase() || '?'}
        </div>
        <h2 className="mt-4 text-center font-display text-2xl font-semibold text-parchment-light">
          {profile.name}
        </h2>
        <p className="text-center text-sm text-parchment/55">{profile.email}</p>
        <p className="mt-1 text-center text-xs text-parchment/40">
          House: {HOUSE_LABELS[profile.house]}
        </p>
        <p className="mt-1 text-center text-xs text-parchment/40">
          Enrolled since {formatDate(profile.createdAt)}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-gold/10 pt-4 text-center">
          <div>
            <dt className="text-xs text-parchment/45">Total</dt>
            <dd className="font-display text-xl text-gold-light">{profile.totalTasks}</dd>
          </div>
          <div>
            <dt className="text-xs text-parchment/45">Mastered</dt>
            <dd className="font-display text-xl text-gold-light">{profile.completedTasks}</dd>
          </div>
          <div>
            <dt className="text-xs text-parchment/45">Progress</dt>
            <dd className="font-display text-xl text-gold-light">{profile.completionPercentage}%</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSave} className="parchment-card space-y-5 p-6 lg:col-span-2">
        <h3 className="font-display text-xl font-semibold text-parchment-light">Edit Profile</h3>

        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-sm text-parchment/80">
            Name
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gold/25 bg-midnight-light px-3 py-2.5 text-parchment-light focus:border-gold/60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-parchment/80">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full cursor-not-allowed rounded-md border border-gold/10 bg-midnight-light/50 px-3 py-2.5 text-parchment/50"
          />
          <p className="mt-1 text-xs text-parchment/35">Email cannot be changed from this page.</p>
        </div>

        <HouseSelector value={house} onChange={(value) => setHouse(value as ProfileData['house'])} />

        {error && (
          <p role="alert" className="rounded-md bg-burgundy/20 px-3 py-2 text-sm text-parchment-light">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-midnight transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
