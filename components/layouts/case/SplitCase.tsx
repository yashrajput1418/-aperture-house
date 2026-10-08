'use client';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import ProjectFilm from '@/components/work/ProjectFilm';
import NextShoot from '@/components/work/NextShoot';
import ReadingProgress from '@/components/work/ReadingProgress';
import Reveal from '@/components/ui/Reveal';
import type { Project } from '@/content/site';

/** Pinned info column on the left, one long stream of frames scrolling past it. */
export default function SplitCase({ p, next }: { p: Project; next: Project }) {
  const frames = [p.cover, ...(p.gallery ?? [])].filter(Boolean);

  return (
    <main className="relative">
      <ReadingProgress />
      <Link
        href="/#work"
        className="fixed left-6 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-sm backdrop-blur transition hover:border-white/40"
      >
        ← All work
      </Link>

      <div className="lg:flex">
        {/* pinned rail */}
        <div className="px-6 pb-12 pt-28 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:w-[42%] lg:shrink-0 lg:overflow-y-auto lg:pb-16">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
            {p.category} · {p.year}
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.92] tracking-tighter sm:text-6xl">
            {p.title}
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">{p.summary}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-7">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Shot for</dt>
              <dd className="mt-2">{p.client}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Where</dt>
              <dd className="mt-2">{p.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Coverage</dt>
              <dd className="mt-2 font-display font-semibold text-accent">{p.result}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">Delivered</dt>
              <dd className="mt-2 text-sm leading-relaxed">{p.services.join(' · ')}</dd>
            </div>
          </dl>

          <div className="mt-10 space-y-8 text-muted">
            <div>
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white">The brief</h2>
              <p className="mt-3 leading-relaxed">{p.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white">How we shot it</h2>
              <p className="mt-3 leading-relaxed">{p.solution}</p>
            </div>
            <div>
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white">What they got</h2>
              <p className="mt-3 leading-relaxed">{p.outcome}</p>
            </div>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {p.metrics.map((m) => (
              <li key={m.label}>
                <p className="font-display text-2xl font-bold text-accent">{m.value}</p>
                <p className="mt-1 text-xs text-muted">{m.label}</p>
              </li>
            ))}
          </ul>

          <a
            href="/#contact"
            className="mt-10 block rounded-full bg-accent px-6 py-3.5 text-center font-display font-semibold text-ink"
          >
            Book a shoot like this
          </a>
        </div>

        {/* image stream */}
        <div className="min-w-0 flex-1 space-y-3 px-3 pb-3 lg:pt-3">
          {frames.map((img, i) => (
            <div key={img!.src} className="relative overflow-hidden rounded-2xl border border-line">
              <SafeImage
                src={img!.src}
                alt={img!.alt ? `${p.title} — ${img!.alt}` : `${p.title} — frame ${i + 1}`}
                width={img!.width}
                height={img!.height}
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority={i === 0}
                placeholder={img!.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={img!.blurDataURL}
                className="h-auto w-full"
                gradient={p.gradient}
                placeholderLabel={p.title}
                placeholderClassName="aspect-[3/2]"
              />
            </div>
          ))}

          {p.video && (
            <Reveal className="pt-6">
              <ProjectFilm video={p.video} title={p.title} />
            </Reveal>
          )}
        </div>
      </div>

      <NextShoot project={next} />
    </main>
  );
}
