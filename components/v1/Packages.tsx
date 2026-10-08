import { packages, site } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

export default function Packages() {
  return (
    <section id="packages" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow="Packages"
          title={<>What it <span className="text-accent">costs</span></>}
        />
        <Reveal delay={0.1}>
          <p className="max-w-xs text-muted">
            Starting prices, not quotes. Every date is different — tell us yours and you get a
            real number the same day.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {packages.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`flex h-full flex-col rounded-3xl border p-8 transition-colors ${
                p.popular ? 'border-accent/50 bg-accent/[0.06]' : 'border-line bg-ink-2 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                {p.popular && (
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
                    Most booked
                  </span>
                )}
              </div>
              <p className="mt-5 font-display text-4xl font-bold">{p.price}</p>
              <p className="mt-1 text-sm text-muted">{p.unit}</p>
              <p className="mt-5 leading-relaxed text-muted">{p.summary}</p>

              <ul className="mt-8 space-y-3 border-t border-line pt-8 text-sm">
                {p.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="text-accent">✓</span>
                    <span className="text-muted">{line}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 block rounded-full px-6 py-4 text-center font-display font-semibold transition ${
                  p.popular
                    ? 'bg-accent text-ink hover:shadow-[0_0_40px_-6px_var(--color-accent)]'
                    : 'border border-line hover:border-white/40'
                }`}
              >
                Check your date
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      {/* studio rental strip */}
      <Reveal delay={0.1}>
        <div className="mt-6 grid gap-8 rounded-3xl border border-line bg-ink-2 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-accent">Studio rental</p>
            <h3 className="mt-4 font-display text-3xl font-semibold">{site.studio.title}</h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">{site.studio.text}</p>
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <p className="font-display text-3xl font-bold text-accent">{site.studio.price}</p>
              <p className="text-sm text-muted">{site.studio.note}</p>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-center text-sm">
            {site.studio.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden className="text-accent">·</span>
                <span className="text-muted">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
