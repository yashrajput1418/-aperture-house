'use client';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import SafeImage from '@/components/ui/SafeImage';
import CaseHero from '@/components/work/CaseHero';
import CaseStudyGallery from '@/components/work/CaseStudyGallery';
import ProjectFilm from '@/components/work/ProjectFilm';
import NextShoot from '@/components/work/NextShoot';
import ReadingProgress from '@/components/work/ReadingProgress';
import type { Project } from '@/content/site';
import { homeAnchor } from '@/lib/version';

/** Case 1 — full-bleed hero, sticky deliverables rail, numbered sections. */
export default function Case({ p, next }: { p: Project; next: Project }) {
  const [lead, ...rest] = p.gallery ?? [];

  const facts = [
    { label: 'Shot for', value: p.client },
    { label: 'Where', value: p.location },
    { label: 'Year', value: p.year },
    { label: 'Coverage', value: p.result, accent: true },
  ];

  return (

    <main className="relative">
      <ReadingProgress />

      <CaseHero
        image={p.cover}
        gradient={p.gradient}
        title={p.title}
        eyebrow={`${p.category} · ${p.location} · ${p.year}`}
        summary={p.summary}
      />

      {/* back link floats over the hero */}
      <Link
        href={homeAnchor(1, "#work")}
        className="fixed left-6 top-6 z-40 inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-sm backdrop-blur transition hover:border-white/40 sm:left-10"
      >
        ← All work
      </Link>

      {/* fact strip */}
      <section className="border-y border-line bg-ink-2/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">{f.label}</p>
              <p className={`mt-3 font-display text-xl ${f.accent ? 'font-semibold text-accent' : ''}`}>{f.value}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* the story, with the deliverables parked in a sticky rail */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
          <div className="space-y-20">
            <Reveal>
              <p className="font-display text-sm text-accent">01 — The brief</p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                What we walked into
              </h2>
              <p className="mt-7 text-lg leading-relaxed text-muted sm:text-xl">{p.challenge}</p>
            </Reveal>

            <Reveal>
              <p className="font-display text-sm text-accent">02 — The approach</p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                How we shot it
              </h2>
              <p className="mt-7 text-lg leading-relaxed text-muted sm:text-xl">{p.solution}</p>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-line bg-ink-2 p-8">
                <p className="font-display text-xs uppercase tracking-[0.25em] text-accent">Delivered</p>
                <ul className="mt-7 space-y-4">
                  {p.services.map((s) => (
                    <li key={s} className="flex gap-3 text-muted">
                      <span aria-hidden className="text-accent">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</span>
                  ))}
                </div>
                <a
                  href={homeAnchor(1, "#contact")}
                  className="mt-8 block rounded-full bg-accent px-6 py-3.5 text-center font-display font-semibold text-ink transition hover:shadow-[0_0_40px_-6px_var(--color-accent)]"
                >
                  Book a shoot like this
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* one frame, full width */}
      {lead && (
        <section className="relative h-[70svh] min-h-[380px] overflow-hidden">
          <SafeImage
            src={lead.src}
            alt={lead.alt ? `${p.title} — ${lead.alt}` : p.title}
            fill
            sizes="100vw"
            placeholder={lead.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={lead.blurDataURL}
            className="object-cover"
            gradient={p.gradient}
            placeholderLabel={p.title}
          />
        </section>
      )}

      {/* the numbers, full-bleed */}
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

      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
          <Reveal>
            <p className="font-display text-sm text-accent">03 — The shoot</p>
            <h2 className="mt-5 font-display text-3xl font-semibold sm:text-5xl">Selected frames</h2>
          </Reveal>
          <div className="mt-14">
            <CaseStudyGallery images={rest} title={p.title} />
          </div>
        </section>
      )}

      {p.video && (
        <section className="border-y border-line bg-ink-2/40">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
            <Reveal>
              <p className="font-display text-sm text-accent">04 — The film</p>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-5xl">Moving pictures</h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-14">
              <ProjectFilm video={p.video} title={p.title} />
            </Reveal>
          </div>
        </section>
      )}

      {/* closing statement, set large */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center sm:px-10 sm:py-36">
        <Reveal>
          <p className="font-display text-sm text-accent">05 — What they got</p>
          <p className="mt-8 font-display text-2xl font-medium leading-snug sm:text-4xl sm:leading-snug">
            {p.outcome}
          </p>
        </Reveal>
        {(p.cover?.credit || p.video?.credit) && (
          <p className="mt-16 text-xs leading-relaxed text-muted">
            Imagery on this page is free-licensed stock standing in for real client shoots.{' '}
            <Link href="/credits" className="underline hover:text-white">Full media credits →</Link>
          </p>
        )}
      </section>

      <NextShoot project={next} version={1} />
    </main>
  
  );
}
