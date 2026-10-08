'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects } from '@/content/site';
import { workHref } from '@/lib/version';

/**
 * Work as a typographic index. Hovering a row floats that shoot's cover
 * near the cursor — pointer devices only; touch gets a thumbnail inline.
 */
export default function Work() {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  const x = useSpring(useMotionValue(0), { stiffness: 140, damping: 20, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 140, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const current = active === null ? null : projects[active];

  return (
    <section id="work" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Selected work
          </h2>
          <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
            {projects.length} shoots · 2024—2026
          </p>
        </div>

        <div ref={wrap} onMouseMove={onMove} className="relative">
          <AnimatePresence>
            {current && !reduce && (
              <motion.div
                key={current.slug}
                style={{ x, y }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
              >
                <div className="relative h-60 w-[22rem] overflow-hidden border border-line">
                  {current.cover && (
                    <SafeImage
                      src={current.cover.src}
                      alt=""
                      aria-hidden
                      fill
                      sizes="352px"
                      placeholder={current.cover.blurDataURL ? 'blur' : 'empty'}
                      blurDataURL={current.cover.blurDataURL}
                      className="object-cover"
                      gradient={current.gradient}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="divide-y divide-line">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={workHref(2, p.slug)}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-5 py-7 sm:grid-cols-[3.5rem_1fr_10rem_6rem_1.5rem] sm:gap-8 sm:py-9"
                >
                  <span className="font-display text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>

                  <span className="flex min-w-0 items-center gap-4">
                    {/* touch devices get the frame inline instead of on the cursor */}
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden border border-line lg:hidden">
                      {p.cover && (
                        <SafeImage
                          src={p.cover.src} alt="" aria-hidden fill sizes="64px"
                          placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
                          blurDataURL={p.cover.blurDataURL}
                          className="object-cover" gradient={p.gradient}
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-2xl font-semibold transition-colors group-hover:text-accent sm:text-[2.6rem] sm:leading-[1.05]">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted sm:hidden">
                        {p.category} · {p.location}
                      </span>
                    </span>
                  </span>

                  <span className="hidden text-sm text-muted sm:block">{p.category}</span>
                  <span className="hidden text-sm text-muted sm:block">{p.year}</span>
                  <span className="hidden text-accent opacity-0 transition-opacity group-hover:opacity-100 sm:block">→</span>
                  <span className="text-accent sm:hidden">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
