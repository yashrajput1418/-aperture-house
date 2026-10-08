'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { services } from '@/content/site';
import { useDragScroll } from '@/lib/useDragScroll';

/**
 * A slider, not a grid: the strip carries controls so it never reads as a
 * row of cards clipped by the viewport. Native horizontal snapping
 * underneath, so a drag, a swipe, a side-scroll or the arrows all drive it
 * and the page keeps scrolling down past it.
 */
export default function Services() {
  const drag = useDragScroll<HTMLDivElement>();
  const track = drag.ref;
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAtEnd(end);
    // at the end the track has run out of travel, so the last card is the
    // one being read even though it is not the leftmost
    if (end) {
      setActive(services.length - 1);
      return;
    }
    const left = el.scrollLeft;
    const slides = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    let best = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.offsetLeft - left);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync(); // so a track that already fits reports itself as finished
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const step = (d: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(services.length - 1, active + d));
    const slide = el.children[next] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 sm:px-10">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">What we shoot</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            Six things we point a camera at
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <p className="font-display text-sm text-muted">
            <span className="text-white">{String(active + 1).padStart(2, '0')}</span>
            {' / '}
            {String(services.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous shoot type"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd || active === services.length - 1}
            aria-label="Next shoot type"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={track}
        tabIndex={0}
        aria-label="Shoot types — drag or swipe sideways"
        {...drag.handlers}
        className={`mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 outline-none sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${drag.className}`}
      >
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.05 }}
            className={`relative flex min-h-[26rem] w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[2rem] border bg-ink-2 p-8 transition-colors duration-500 sm:w-[26rem] sm:p-10 ${
              i === active ? 'border-accent/50' : 'border-line'
            }`}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <p className="font-display text-7xl font-bold leading-none text-white/10">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <span className="text-2xl text-accent">{s.icon}</span>
              </div>
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
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-6 sm:px-10">
        <div className="flex gap-1" aria-hidden>
          {services.map((s, i) => (
            <span
              key={s.title}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= active ? 'bg-accent' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
