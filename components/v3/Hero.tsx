'use client';
import { motion } from 'framer-motion';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import HeroVideo from '@/components/backdrop/HeroVideo';

/** Showreel behind the studio name, centred, with a scroll cue. */
export default function Hero() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <section id="top" className="relative isolate flex h-[100svh] items-center justify-center overflow-hidden">
      <HeroVideo />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
        >
          {site.hero.badge}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-display text-[12vw] font-bold leading-[0.9] tracking-tighter sm:text-[7.5vw] lg:text-[6.5rem]"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-lg text-white/70"
        >
          {site.tagline} {site.location}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#work"
            className="rounded-full bg-accent px-7 py-4 font-display text-sm font-semibold text-ink transition hover:shadow-[0_0_40px_-6px_var(--color-accent)]"
          >
            Watch the work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/25 px-7 py-4 font-display text-sm font-semibold backdrop-blur transition hover:border-white/60"
          >
            Check your date
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60"
      >
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-white/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
