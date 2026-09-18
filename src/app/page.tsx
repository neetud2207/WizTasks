import Link from 'next/link';
import {
  ScrollText,
  Wand2,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { MagicalBackground } from '@/components/MagicalBackground';
import { HeroReveal } from '@/components/HeroReveal';

const FEATURES = [
  {
    icon: ScrollText,
    title: 'Manage Your Assignments',
    body: 'Log every essay, potion, and practical in one ledger, organized by subject and priority.',
  },
  {
    icon: Sparkles,
    title: 'Track Your Progress',
    body: 'Watch your completion charm rise as pending work turns to mastered work.',
  },
  {
    icon: Wand2,
    title: 'Stay Organized',
    body: 'Search, filter, and sort your workload so nothing slips behind a tapestry.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Wizard Accounts',
    body: 'Your ledger is yours alone — encrypted passwords and protected access, always.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Magical Workspace',
    body: 'From the Great Hall to the train platform, your ledger adapts to any device.',
  },
];

const STEPS = [
  { title: 'Create your wizard account', body: 'Register with your name, email, and a house of your choosing.' },
  { title: 'Enter your magical dashboard', body: 'Arrive at a workspace built around your current term.' },
  { title: 'Create assignments', body: 'Add quests with a subject, priority, and due date.' },
  { title: 'Track your progress', body: 'Watch statistics and progress update as you work.' },
  { title: 'Complete your quests', body: 'Mark assignments mastered and clear your ledger.' },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden text-parchment">
      <MagicalBackground />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <span className="font-display text-2xl font-semibold tracking-wide text-gold-light">
          Hogwarts Task Ledger
        </span>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm text-parchment/90 transition hover:text-gold-light sm:px-4"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-gold/90 px-3 py-2 text-sm font-semibold text-midnight transition hover:bg-gold sm:px-4"
          >
            Create Account
          </Link>
        </nav>
      </header>

      <HeroReveal />

      {/* Feature section */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-parchment-light sm:text-4xl">
          Everything your term requires
        </h2>
        <p className="mt-3 max-w-xl text-parchment/70">
          A single ledger for every assignment, charm, and quest — built for students who juggle
          more subjects than hours in the day.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="parchment-card p-6 transition hover:border-gold/50"
            >
              <feature.icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold text-parchment-light">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-parchment/70">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gold/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-parchment-light sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative pl-0">
                <span className="font-display text-4xl text-gold/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-parchment-light">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-parchment/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-parchment-light sm:text-4xl">
          Your parchment is waiting.
        </h2>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-midnight shadow-candle transition hover:bg-gold-light"
        >
          Begin your ledger <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-parchment/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-display text-lg text-gold-light">Hogwarts Task Ledger</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/login" className="hover:text-gold-light">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-gold-light">
              Create account
            </Link>
          </nav>
          <span>Built with Next.js, PostgreSQL &amp; Prisma — an original, non-commercial project.</span>
        </div>
      </footer>
    </main>
  );
}
