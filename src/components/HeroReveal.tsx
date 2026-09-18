'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather } from 'lucide-react';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroReveal() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="mx-auto flex max-w-4xl flex-col items-start px-6 pb-16 pt-16 sm:px-8 sm:pt-24"
    >
      <motion.span
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs text-gold-light"
      >
        <Feather className="h-3.5 w-3.5" /> Now enrolling for the new term
      </motion.span>

      <motion.h1
        variants={item}
        className="mt-6 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-parchment-light sm:text-6xl"
      >
        Your Magical Tasks Await.
      </motion.h1>

      <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-parchment/75">
        Organize your assignments, quests, and daily tasks in one enchanted workspace — built for
        students who need every subject accounted for, from Potions essays to Astronomy charts.
      </motion.p>

      <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-midnight shadow-candle transition hover:bg-gold-light"
        >
          Enter Hogwarts <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-md border border-gold/30 px-6 py-3 font-semibold text-parchment-light transition hover:border-gold/60"
        >
          Create Account
        </Link>
      </motion.div>
    </motion.section>
  );
}
