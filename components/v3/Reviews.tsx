'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { reviews } from '@/content/site';

/**
 * One quote at a time, filling the frame and crossfading like a title
 * sequence. Advancing pauses while the pointer is over the section.
 */
export default function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = reviews.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 7000);
    return () => clearInterval(t);
  }, [paused, total]);

  const r = reviews[i];

  return (
    <section
      id="reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex min-h-[90svh] items-center overflow-hidden border-y border-line"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(90_95_216/0.22),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Client reviews</p>

        <div className="relative mt-12 min-h-[18rem] sm:min-h-[16rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-2xl font-medium leading-snug sm:text-4xl sm:leading-[1.25]">
                &ldquo;{r.quote}&rdquo;
              </p>
              <footer className="mt-10">
                <p className="font-display text-lg font-semibold">
                  {r.name} <span aria-hidden>{r.country}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{r.role} · {r.project}</p>
                <p className="mt-3 text-accent" aria-label={`${r.rating} out of 5 stars`}>
                  {'★'.repeat(r.rating)}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Review ${idx + 1}`}
              aria-current={idx === i}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-10 bg-accent' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
