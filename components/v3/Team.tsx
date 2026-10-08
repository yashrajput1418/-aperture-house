'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { site, team } from '@/content/site';
import { useDragScroll } from '@/lib/useDragScroll';

/**
 * A tall strip of portraits — credits at the end of the film.
 *
 * The strip swipes itself once it reaches the viewport: one portrait every
 * few seconds, stopping at the last. It is a native horizontal snap
 * container underneath, so a drag, a swipe, a side-scroll or the arrows all
 * work, and any of them cancels the auto-advance — it never fights the
 * visitor.
 * Frozen entirely under prefers-reduced-motion.
 */
export default function Team() {
  const drag = useDragScroll<HTMLDivElement>();
  const track = drag.ref;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [inView, setInView] = useState(false);
  const [taken, setTaken] = useState(false); // visitor has driven it themselves
  const auto = useRef(false); // true while a programmatic scroll is in flight

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAtEnd(end);
    // the track stops scrolling before the last portrait reaches the left
    // edge, so treat the end of travel as the last slide
    if (end) {
      setActive(team.length - 1);
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

  const goTo = useCallback(
    (i: number, programmatic = false) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(team.length - 1, i));
      const slide = el.children[next] as HTMLElement | undefined;
      if (!slide) return;
      if (programmatic) {
        auto.current = true;
        window.setTimeout(() => {
          auto.current = false;
        }, 900);
      }
      el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    },
    []
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      sync();
      // a scroll we did not start means the visitor is driving now
      if (!auto.current) setTaken(true);
    };
    sync(); // so a track that already fits reports itself as finished
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  // only runs while the strip is actually on screen
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      threshold: 0.45,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || taken || !inView || atEnd || active >= team.length - 1) return;
    const t = window.setTimeout(() => goTo(active + 1, true), 3200);
    return () => window.clearTimeout(t);
  }, [reduce, taken, inView, atEnd, active, goTo]);

  return (
    <section id="team" className="border-y border-line py-20 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 sm:px-10">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">The studio</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            The people behind the camera
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Shooting together since {site.founded}. The people you meet are the people who turn up.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <p className="font-display text-sm text-muted">
            <span className="text-white">{String(active + 1).padStart(2, '0')}</span>
            {' / '}
            {String(team.length).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setTaken(true); goTo(active - 1); }}
              disabled={active === 0}
              aria-label="Previous person"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => { setTaken(true); goTo(active + 1); }}
              disabled={atEnd || active === team.length - 1}
              aria-label="Next person"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-white"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        tabIndex={0}
        aria-label="The studio — drag or swipe sideways"
        {...drag.handlers}
        onPointerDown={(e) => {
          setTaken(true);
          drag.handlers.onPointerDown(e);
        }}
        className={`mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 outline-none sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${drag.className}`}
      >
        {team.map((m, i) => (
          <figure
            key={m.name}
            className={`group relative h-[62svh] min-h-[380px] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border transition-colors duration-500 sm:w-[20rem] ${
              i === active ? 'border-accent/50' : 'border-line'
            }`}
          >
            {m.portrait ? (
              <SafeImage
                src={m.portrait.src}
                alt={m.name}
                fill
                sizes="(min-width: 640px) 320px, 72vw"
                placeholder={m.portrait.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={m.portrait.blurDataURL}
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                placeholderLabel={m.name}
                placeholderMarkClassName="h-10 w-10"
              />
            ) : (
              <MediaPlaceholder label={m.name} markClassName="h-10 w-10" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-2xl font-semibold">{m.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-accent">{m.role}</p>
              <p
                className={`mt-3 overflow-hidden text-sm leading-relaxed text-white/70 transition-all duration-500 group-hover:max-h-24 ${
                  i === active ? 'max-h-24' : 'max-h-0'
                }`}
              >
                {m.bio}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl items-center gap-5 px-6 sm:px-10">
        <div className="flex flex-1 gap-1" aria-hidden>
          {team.map((m, i) => (
            <span
              key={m.name}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= active ? 'bg-accent' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
        <p className="shrink-0 font-display text-xs uppercase tracking-[0.25em] text-muted">
          Swipe sideways →
        </p>
      </div>
    </section>
  );
}
