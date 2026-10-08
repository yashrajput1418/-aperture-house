'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faqs } from '@/content/site';

/** Two columns of numbered questions; one opens at a time. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Before you ask</p>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-6xl">The honest answers</h2>

        <div className="mt-14 grid gap-x-16 sm:grid-cols-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-t border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-5 py-6 text-left"
                  >
                    <span className="mt-1 font-display text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-display text-lg font-medium leading-snug">{f.q}</span>
                    <span
                      aria-hidden
                      className={`mt-1 shrink-0 text-accent transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    >
                      ＋
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pl-10 leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
