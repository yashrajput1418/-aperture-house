'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import CaseHero from '@/components/work/CaseHero';
import ProjectFilm from '@/components/work/ProjectFilm';
import NextShoot from '@/components/work/NextShoot';
import ReadingProgress from '@/components/work/ReadingProgress';
import Reveal from '@/components/ui/Reveal';
import type { Project } from '@/content/site';
import { homeAnchor } from '@/lib/version';

/**
 * Case 3 — Filmstrip.
 *
 * The frames run down the page at their natural scroll speed; the caption
 * column beside them is pinned and swaps as each frame takes the viewport.
 * This replaces the old horizontal reel, which hijacked the wheel and
 * fought the visitor for the scroll.
 */
export default function Case({ p, next }: { p: Project; next: Project }) {
  const frames = [p.cover, ...(p.gallery ?? [])].filter(Boolean) as NonNullable<Project['cover']>[];
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  const beats = [
    { n: '01', h: 'The brief', body: p.challenge },
    { n: '02', h: 'How we shot it', body: p.solution },
    { n: '03', h: 'What they got', body: p.outcome },
  ];
  /** Each beat covers its share of the strip, so the text moves with the frames. */
  const perBeat = Math.max(1, Math.ceil(frames.length / beats.length));
  const beat = beats[Math.min(beats.length - 1, Math.floor(active / perBeat))];

  useEffect(() => {
    const nodes = items.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // whichever frame is showing most of itself owns the caption
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(Number((best.target as HTMLElement).dataset.index));
      },
      { threshold: [0.35, 0.6, 0.9], rootMargin: '-15% 0px -15% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [frames.length]);

  const current = frames[active];

  return (
    <main className="relative">
      <ReadingProgress />

      <Link
        href={homeAnchor(3, '#work')}
        className="fixed left-6 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-sm backdrop-blur transition hover:border-white/40 sm:left-10"
      >
        ← All work
      </Link>

      <CaseHero
        image={p.cover}
        gradient={p.gradient}
        title={p.title}
        eyebrow={`${p.category} · ${p.location} · ${p.year}`}
        summary={p.summary}
      />

      {/* fact strip */}
      <section className="border-y border-line bg-ink-2/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {[
            { label: 'Shot for', value: p.client },
            { label: 'Where', value: p.location },
            { label: 'Coverage', value: p.result, accent: true },
            { label: 'Delivered', value: p.services.length + ' deliverables' },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">{f.label}</p>
              <p className={`mt-3 font-display text-xl ${f.accent ? 'font-semibold text-accent' : ''}`}>{f.value}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* the strip: frames scroll, the caption column stays */}
      <section className="mx-auto max-w-[100rem] px-3 py-16 sm:px-6 sm:py-24">
        <div className="lg:grid lg:grid-cols-[22rem_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <div className="px-3 lg:px-0">
              <p className="font-display text-sm text-accent">
                Frame {String(active + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
              </p>

              {/* a bar instead of dots: it stays readable at twenty frames */}
              <div className="mt-4 flex gap-1" aria-hidden>
                {frames.map((f, i) => (
                  <span
                    key={f.src}
                    className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                      i <= active ? 'bg-accent' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={beat.n + active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="mt-9"
                >
                  <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">
                    {beat.n} — {beat.h}
                  </p>
                  <p className="mt-5 leading-relaxed text-muted">{beat.body}</p>
                  {current?.alt && (
                    <p className="mt-7 border-t border-line pt-5 text-sm text-white/60">{current.alt}</p>
                  )}
                </motion.div>
              </AnimatePresence>

              <ul className="mt-9 space-y-2.5 border-t border-line pt-7 text-sm">
                {p.services.map((s) => (
                  <li key={s} className="flex gap-3 text-muted">
                    <span aria-hidden className="text-accent">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <a
                href={homeAnchor(3, '#contact')}
                className="mt-8 inline-block rounded-full bg-accent px-6 py-3.5 font-display text-sm font-semibold text-ink"
              >
                Book a shoot like this
              </a>
            </div>
          </div>

          <div className="mt-12 space-y-3 lg:mt-0">
            {frames.map((img, i) => (
              <figure
                key={img.src}
                data-index={i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                className="relative h-[72svh] min-h-[360px] overflow-hidden rounded-2xl border border-line sm:h-[86svh]"
              >
                <SafeImage
                  src={img.src}
                  alt={img.alt ? `${p.title} — ${img.alt}` : `${p.title} — frame ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  priority={i === 0}
                  placeholder={img.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={img.blurDataURL}
                  className="object-cover"
                  gradient={p.gradient}
                  placeholderLabel={p.title}
                />
                <figcaption className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 font-display text-xs backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* the numbers */}
      <section className="border-y border-line bg-gradient-to-b from-ink-2/60 to-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 sm:py-28 md:grid-cols-3">
          {p.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <p className="font-display text-6xl font-bold leading-none text-accent sm:text-7xl">{m.value}</p>
              <p className="mt-4 text-muted">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {p.video && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
          <Reveal>
            <p className="font-display text-sm text-accent">The film</p>
            <h2 className="mt-5 font-display text-3xl font-semibold sm:text-5xl">Moving pictures</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <ProjectFilm video={p.video} title={p.title} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-28 text-center sm:px-10">
        <Reveal>
          <p className="font-display text-2xl font-medium leading-snug sm:text-4xl sm:leading-snug">{p.outcome}</p>
        </Reveal>
        {(p.cover?.credit || p.video?.credit) && (
          <p className="mt-14 text-xs leading-relaxed text-muted">
            Imagery on this page is free-licensed stock standing in for real client shoots.{' '}
            <Link href="/credits" className="underline hover:text-white">Full media credits →</Link>
          </p>
        )}
      </section>

      <NextShoot project={next} version={3} />
    </main>
  );
}
