'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';

/**
 * Work as a typographic index. Hovering a row floats that shoot's cover
 * near the cursor — on pointer devices only; touch gets a thumbnail inline.
 */
export default function WorkList() {
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
    <section id="work" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <SectionHeading eyebrow="Selected work" title={<>Days we were <span className="text-outline">lucky</span> to shoot</>} />

      <div ref={wrap} onMouseMove={onMove} className="relative mt-16">
        {/* the floating preview, desktop only */}
        <AnimatePresence>
          {current && !reduce && (
            <motion.div
              key={current.slug}
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
            >
              <div className="relative h-56 w-80 overflow-hidden rounded-2xl border border-line">
                {current.cover && (
                  <SafeImage
                    src={current.cover.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="320px"
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

        <ul className="divide-y divide-line border-y border-line">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/work/${p.slug}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group flex items-center gap-5 py-6 transition-colors sm:gap-10 sm:py-8"
              >
                <span className="w-8 shrink-0 font-display text-sm text-muted">{String(i + 1).padStart(2, '0')}</span>

                {/* touch devices get the image inline instead of following a cursor */}
                <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line lg:hidden">
                  {p.cover && (
                    <SafeImage
                      src={p.cover.src} alt="" aria-hidden fill sizes="80px"
                      placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
                      blurDataURL={p.cover.blurDataURL}
                      className="object-cover" gradient={p.gradient}
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-2xl font-semibold transition-colors group-hover:text-accent sm:text-4xl">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{p.category}</span>
                </span>

                <span className="hidden shrink-0 text-right text-sm text-muted sm:block">
                  {p.location}
                  <span className="block">{p.year}</span>
                </span>
                <span className="shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
