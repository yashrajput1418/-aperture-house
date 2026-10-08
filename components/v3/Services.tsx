'use client';
import { motion } from 'framer-motion';
import { services } from '@/content/site';

/**
 * A swipeable strip of shoot types. Snapping is horizontal here, which
 * keeps the page reading as a reel rather than a list.
 */
export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">What we shoot</p>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Six things we point a camera at
        </h2>
        <p className="mt-5 text-sm text-muted">Swipe sideways →</p>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 sm:px-10 [scrollbar-width:none]">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.05 }}
            className="relative flex min-h-[26rem] w-[82vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-8 sm:w-[26rem] sm:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <p className="font-display text-7xl font-bold leading-none text-white/10">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-8 font-display text-3xl font-semibold leading-tight">{s.title}</h3>
              <p className="mt-5 leading-relaxed text-muted">{s.text}</p>
            </div>
            <a
              href="#contact"
              className="relative mt-10 inline-flex items-center gap-3 font-display text-sm font-semibold text-accent"
            >
              Enquire <span aria-hidden>→</span>
            </a>
          </motion.article>
        ))}
        <div className="w-2 shrink-0 sm:w-6" />
      </div>
    </section>
  );
}
