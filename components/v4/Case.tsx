'use client';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import ProjectFilm from '@/components/work/ProjectFilm';
import NextShoot from '@/components/work/NextShoot';
import ReadingProgress from '@/components/work/ReadingProgress';
import Reveal from '@/components/ui/Reveal';
import type { Project } from '@/content/site';
import { homeAnchor } from '@/lib/version';

/**
 * Case 4 — Split.
 * A pinned record of the shoot on the left, every frame streaming past it
 * on the right, in the same hairline grid the archive uses.
 */
export default function Case({ p, next }: { p: Project; next: Project }) {
  const frames = [p.cover, ...(p.gallery ?? [])].filter(Boolean);

  const record: [string, string][] = [
    ['Client', p.client],
    ['Category', p.category],
    ['Where', p.location],
    ['Year', p.year],
    ['Coverage', p.result],
    ['Frames online', String(frames.length)],
  ];

  return (
    <main className="relative">
      <ReadingProgress />
      <Link
        href={homeAnchor(4, '#work')}
        className="fixed left-5 top-5 z-40 inline-flex items-center gap-2 border border-line bg-ink/80 px-3.5 py-2 font-display text-xs backdrop-blur transition hover:border-accent hover:text-accent"
      >
        ← Archive
      </Link>

      <div className="lg:flex">
        {/* the record */}
        <div className="border-b border-line px-5 pb-10 pt-20 sm:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-[26rem] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:pb-10">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-accent">
            {p.category} · {p.year}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">
            {p.title}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">{p.summary}</p>

          <dl className="mt-8 border border-line text-sm">
            {record.map(([k, v], i) => (
              <div key={k} className={`flex justify-between gap-6 p-3 ${i > 0 ? 'border-t border-line' : ''}`}>
                <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">{k}</dt>
                <dd className={`text-right ${k === 'Coverage' ? 'font-display font-semibold text-accent' : ''}`}>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 space-y-6 text-sm">
            {[
              ['The brief', p.challenge],
              ['How we shot it', p.solution],
              ['What they got', p.outcome],
            ].map(([h, body]) => (
              <div key={h}>
                <h2 className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-white">{h}</h2>
                <p className="mt-2.5 leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-px border border-line bg-line">
            {p.metrics.map((m) => (
              <li key={m.label} className="bg-ink p-3">
                <p className="font-display text-xl font-bold text-accent">{m.value}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-muted">{m.label}</p>
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-1.5 border-t border-line pt-5 text-sm">
            {p.services.map((s) => (
              <li key={s} className="flex gap-2.5 text-muted">
                <span aria-hidden className="text-accent">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <a
            href={homeAnchor(4, '#contact')}
            className="mt-7 block border border-accent px-5 py-3 text-center font-display text-sm font-semibold text-accent transition hover:bg-accent hover:text-ink"
          >
            Book a shoot like this
          </a>
        </div>

        {/* the stream */}
        <div className="min-w-0 flex-1 bg-line">
          <div className="grid gap-px sm:grid-cols-2">
            {frames.map((img, i) => (
              <figure
                key={img!.src}
                className={`relative bg-ink ${i % 3 === 0 ? 'sm:col-span-2' : ''}`}
              >
                <SafeImage
                  src={img!.src}
                  alt={img!.alt ? `${p.title} — ${img!.alt}` : `${p.title} — frame ${i + 1}`}
                  width={img!.width}
                  height={img!.height}
                  sizes={i % 3 === 0 ? '(min-width: 1024px) 64vw, 100vw' : '(min-width: 1024px) 32vw, 50vw'}
                  priority={i === 0}
                  placeholder={img!.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={img!.blurDataURL}
                  className="h-auto w-full"
                  gradient={p.gradient}
                  placeholderLabel={p.title}
                  placeholderClassName="aspect-[3/2]"
                />
                <figcaption className="absolute left-3 top-3 bg-black/50 px-2 py-0.5 font-display text-[0.6rem] backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                  {img!.alt ? ` · ${img!.alt}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>

          {p.video && (
            <Reveal className="bg-ink p-5 sm:p-8">
              <ProjectFilm video={p.video} title={p.title} />
            </Reveal>
          )}

          {(p.cover?.credit || p.video?.credit) && (
            <p className="bg-ink px-5 pb-8 text-[0.7rem] leading-relaxed text-muted sm:px-8">
              Imagery on this page is free-licensed stock standing in for real client shoots.{' '}
              <Link href="/credits" className="underline hover:text-white">Full media credits →</Link>
            </p>
          )}
        </div>
      </div>

      <NextShoot project={next} version={4} />
    </main>
  );
}
