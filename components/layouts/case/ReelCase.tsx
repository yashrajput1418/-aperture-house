'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import NextShoot from '@/components/work/NextShoot';
import type { Project } from '@/content/site';

/**
 * The gallery is the spine: one horizontal track you drive with the wheel,
 * with story panels set between groups of frames.
 *
 * Vertical wheel is translated to horizontal scroll on pointer devices only;
 * touch keeps its native horizontal swipe, and the track is keyboard
 * scrollable because it is a focusable scroll container.
 */
export default function ReelCase({ p, next }: { p: Project; next: Project }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      // let the page scroll on past the ends instead of trapping the visitor
      if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const frames = (p.gallery ?? []).filter(Boolean);
  const panels = [
    { n: '01', h: 'The brief', body: p.challenge },
    { n: '02', h: 'How we shot it', body: p.solution },
    { n: '03', h: 'What they got', body: p.outcome },
  ];

  // frames, with a story panel dropped in after every third
  const items: React.ReactNode[] = [];
  let panelIdx = 0;
  frames.forEach((img, i) => {
    items.push(
      <figure key={img.src} className="relative h-full w-[78vw] shrink-0 overflow-hidden rounded-2xl border border-line sm:w-[46vw] lg:w-[32vw]">
        <SafeImage
          src={img.src}
          alt={img.alt ? `${p.title} — ${img.alt}` : `${p.title} — frame ${i + 1}`}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
          priority={i < 2}
          placeholder={img.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={img.blurDataURL}
          className="object-cover"
          gradient={p.gradient}
          placeholderLabel={p.title}
        />
      </figure>
    );
    if ((i + 1) % 3 === 0 && panels[panelIdx]) {
      const s = panels[panelIdx++];
      items.push(
        <div key={s.n} className="flex h-full w-[78vw] shrink-0 flex-col justify-center px-2 sm:w-[40vw] lg:w-[28vw]">
          <p className="font-display text-sm text-accent">{s.n} — {s.h}</p>
          <p className="mt-5 text-base leading-relaxed text-muted">{s.body}</p>
        </div>
      );
    }
  });

  return (
    <main className="relative">
      <Link
        href="/#work"
        className="fixed left-6 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-sm backdrop-blur transition hover:border-white/40"
      >
        ← All work
      </Link>

      <header className="mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
          {p.category} · {p.location} · {p.year}
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl font-bold leading-[0.92] tracking-tighter sm:text-7xl">{p.title}</h1>
          <p className="max-w-sm text-muted">{p.summary}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-6 text-sm">
          <span className="text-muted">Shot for <span className="text-white">{p.client}</span></span>
          <span className="text-muted">Coverage <span className="font-semibold text-accent">{p.result}</span></span>
          <span className="text-muted">Delivered <span className="text-white">{p.services.join(' · ')}</span></span>
        </div>
      </header>

      {/* the spine */}
      <div
        ref={track}
        tabIndex={0}
        aria-label={`${p.title} — frames and notes, scrolls horizontally`}
        className="flex h-[62svh] min-h-[380px] snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 outline-none [scrollbar-width:thin] sm:px-10"
      >
        {items.map((node, i) => (
          <div key={i} className="h-full snap-center">{node}</div>
        ))}
      </div>

      <p className="mx-auto mt-4 max-w-7xl px-6 text-xs uppercase tracking-[0.25em] text-muted sm:px-10">
        Scroll sideways →
      </p>

      <section className="mx-auto mt-20 grid max-w-7xl gap-10 border-t border-line px-6 py-16 sm:px-10 md:grid-cols-3">
        {p.metrics.map((m) => (
          <div key={m.label}>
            <p className="font-display text-5xl font-bold text-accent">{m.value}</p>
            <p className="mt-3 text-muted">{m.label}</p>
          </div>
        ))}
      </section>

      <NextShoot project={next} />
    </main>
  );
}
