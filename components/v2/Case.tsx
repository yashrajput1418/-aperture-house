'use client';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import ProjectFilm from '@/components/work/ProjectFilm';
import NextShoot from '@/components/work/NextShoot';
import ReadingProgress from '@/components/work/ReadingProgress';
import Reveal from '@/components/ui/Reveal';
import type { Project } from '@/content/site';
import type { MediaImage } from '@/content/media';
import { homeAnchor } from '@/lib/version';

function FullBleed({ img, p, priority = false }: { img: MediaImage; p: Project; priority?: boolean }) {
  return (
    <figure className="relative my-20 h-[80svh] min-h-[420px] w-full overflow-hidden sm:my-28">
      <SafeImage
        src={img.src}
        alt={img.alt ? `${p.title} — ${img.alt}` : p.title}
        fill
        sizes="100vw"
        priority={priority}
        placeholder={img.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={img.blurDataURL}
        className="object-cover"
        gradient={p.gradient}
        placeholderLabel={p.title}
      />
      {img.alt && (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink to-transparent px-6 pb-5 pt-16 text-xs text-white/60 sm:px-10">
          {img.alt}
        </figcaption>
      )}
    </figure>
  );
}

/** Case 2 — a printed essay measure, interrupted by edge-to-edge frames. */
export default function Case({ p, next }: { p: Project; next: Project }) {
  const g = p.gallery ?? [];
  const measure = 'mx-auto max-w-[36rem] px-6';

  const sections = [
    { n: '01', h: 'The brief', body: p.challenge },
    { n: '02', h: 'How we shot it', body: p.solution },
    { n: '03', h: 'What they got', body: p.outcome },
  ];

  return (
    <main className="relative">
      <ReadingProgress />
      <Link
        href={homeAnchor(2, '#work')}
        className="fixed left-6 top-6 z-40 inline-flex items-center gap-2 border border-line bg-ink/70 px-4 py-2 font-display text-[0.65rem] uppercase tracking-[0.22em] backdrop-blur transition hover:border-white/40"
      >
        ← All work
      </Link>

      {p.cover && <FullBleed img={p.cover} p={p} priority />}

      <header className={`${measure} text-center`}>
        <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-accent">
          {p.category} · {p.location} · {p.year}
        </p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">{p.title}</h1>
        <p className="mt-7 text-lg leading-relaxed text-muted">{p.summary}</p>
        <div className="mx-auto mt-10 h-px w-16 bg-accent" />
      </header>

      {sections.map((s, i) => (
        <div key={s.n}>
          <Reveal className={`${measure} mt-20 sm:mt-24`}>
            <p className="font-display text-sm text-accent">
              {s.n} — {s.h}
            </p>
            <p className="mt-6 text-lg leading-[1.75] text-muted">{s.body}</p>
          </Reveal>
          {g[i] && <FullBleed img={g[i]} p={p} />}
        </div>
      ))}

      {/* the facts, set like a colophon */}
      <Reveal className={`${measure} mt-20`}>
        <dl className="divide-y divide-line border-y border-line text-sm">
          {[
            ['Client', p.client],
            ['Delivered', p.services.join(', ')],
            ['Coverage', p.result],
            ...p.metrics.map((m) => [m.label, m.value] as [string, string]),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-8 py-4">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <a
          href={homeAnchor(2, '#contact')}
          className="mt-10 inline-block font-display text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent"
        >
          Book a shoot like this →
        </a>
      </Reveal>

      {/* remaining frames, two-up */}
      {g.length > 3 && (
        <div className="mx-auto mt-20 grid max-w-6xl gap-3 px-3 sm:grid-cols-2">
          {g.slice(3).map((img, i) => (
            <div key={img.src} className="relative overflow-hidden border border-line">
              <SafeImage
                src={img.src}
                alt={`${p.title} — frame ${i + 4}`}
                width={img.width}
                height={img.height}
                sizes="(min-width: 640px) 48vw, 100vw"
                placeholder={img.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={img.blurDataURL}
                className="h-auto w-full"
                gradient={p.gradient}
                placeholderLabel={p.title}
                placeholderClassName="aspect-[3/2]"
              />
            </div>
          ))}
        </div>
      )}

      {p.video && (
        <Reveal className="mx-auto mt-20 max-w-6xl px-6">
          <ProjectFilm video={p.video} title={p.title} />
        </Reveal>
      )}

      <div className="h-24" />
      <NextShoot project={next} version={2} />
    </main>
  );
}
