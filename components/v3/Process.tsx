'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { process } from '@/content/site';

/**
 * The four steps as a pinned sequence: the heading holds still while each
 * step scrolls through it, with a bar tracking progress.
 */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="process" ref={ref} className="relative border-y border-line" style={{ height: `${process.length * 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">How we work</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Four steps, start to album
          </h2>

          <div className="mt-10 h-px w-full bg-line">
            <motion.div style={{ width }} className="h-px bg-accent" />
          </div>

          <div className="mt-12 space-y-10 sm:space-y-14">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0.15 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: '-45% 0px -45% 0px' }}
                transition={{ duration: 0.4 }}
                className="grid gap-3 sm:grid-cols-[6rem_1fr_1.2fr] sm:items-baseline sm:gap-10"
              >
                <span className="font-display text-5xl font-bold text-accent sm:text-6xl">{p.step}</span>
                <h3 className="font-display text-2xl font-semibold sm:text-4xl">{p.title}</h3>
                <p className="max-w-lg leading-relaxed text-muted">{p.text}</p>
                {/* each step owns a slice of the scroll so the bar tracks it */}
                <span className="sr-only">Step {i + 1} of {process.length}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
