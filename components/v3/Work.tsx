'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects } from '@/content/site';
import { workHref } from '@/lib/version';

/**
 * The shoots as full-screen slides driven by the page scroll.
 *
 * The section is `projects.length` screens tall and pins its content for
 * that whole distance, so an ordinary mouse-wheel scroll walks the deck
 * sideways one shoot at a time and then releases the page. Nothing is
 * hijacked: the wheel still means "down", we only map that distance onto
 * `x`, so trackpads, touch and keyboard paging all behave normally.
 */
export default function Work() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  // one screen per shoot: progress 0→1 travels the whole track minus the last slide
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(projects.length - 1) * 100}vw`]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.round(v * (projects.length - 1));
    setActive((prev) => (prev === i ? prev : i));
  });

  /** Arrows move the page, since the page scroll is what drives the deck. */
  const step = (d: number) => {
    const el = section.current;
    if (!el) return;
    const next = Math.max(0, Math.min(projects.length - 1, active + d));
    const slideHeight = (el.offsetHeight - window.innerHeight) / (projects.length - 1);
    window.scrollTo({ top: el.offsetTop + next * slideHeight, behavior: 'smooth' });
  };

  return (
    <section
      id="work"
      ref={section}
      className="relative"
      style={{ height: `${projects.length * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the track */}
        <motion.div style={{ x }} className="flex h-full">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={workHref(3, p.slug)}
              className="group relative flex h-full w-screen shrink-0 items-end overflow-hidden"
            >
              {p.cover && (
                <SafeImage
                  src={p.cover.src}
                  alt=""
                  aria-hidden
                  fill
                  sizes="100vw"
                  priority={i < 2}
                  placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={p.cover.blurDataURL}
                  className="object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                  gradient={p.gradient}
                  placeholderLabel={p.title}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 sm:pb-28">
                <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
                  {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {p.category}
                </p>
                <h3 className="mt-4 font-display text-[12vw] font-bold leading-[0.9] tracking-tighter sm:text-[7vw] lg:text-[5.5rem]">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-xl text-lg text-white/70">{p.summary}</p>
                <span className="mt-8 inline-flex items-center gap-3 font-display text-sm font-semibold text-accent">
                  {p.location} · {p.year}
                  <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* heading and controls ride above the deck */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-ink/80 to-transparent pt-24 sm:pt-28">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-5 px-6 pb-10 sm:px-10">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Recent shoots</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Days we were lucky to shoot
              </h2>
            </div>

            <div className="pointer-events-auto flex items-center gap-4">
              <p className="font-display text-sm text-muted">
                <span className="text-white">{String(active + 1).padStart(2, '0')}</span>
                {' / '}
                {String(projects.length).padStart(2, '0')}
              </p>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={active === 0}
                aria-label="Previous shoot"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-ink/40 backdrop-blur transition hover:border-accent hover:text-accent disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={active === projects.length - 1}
                aria-label="Next shoot"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-ink/40 backdrop-blur transition hover:border-accent hover:text-accent disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* progress across the bottom, filled by the same scroll */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-7 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-5">
              <div className="h-0.5 flex-1 bg-white/15">
                <motion.div style={{ scaleX: scrollYProgress }} className="h-0.5 origin-left bg-accent" />
              </div>
              <p className="shrink-0 font-display text-[0.65rem] uppercase tracking-[0.25em] text-white/60">
                Keep scrolling →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
