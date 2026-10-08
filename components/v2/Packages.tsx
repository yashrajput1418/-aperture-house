import { packages, site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/**
 * Version 2 prints the packages as a rate card: three ruled columns side
 * by side, read down rather than across, with the studio rental set as a
 * footnote underneath.
 */
export default function Packages() {
  return (
    <section id="packages" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Rate card</h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Starting prices, not quotes. Every date is different — tell us yours and you get a real
            number the same day.
          </p>
        </div>

        <div className="grid lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.06}
              className={`border-b border-line py-12 lg:border-b-0 lg:px-10 lg:first:pl-0 lg:last:pr-0 ${
                i < packages.length - 1 ? 'lg:border-r' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                {p.popular && (
                  <span className="font-display text-[0.6rem] uppercase tracking-[0.22em] text-accent">
                    Most booked
                  </span>
                )}
              </div>

              <p className="mt-8 font-display text-5xl font-bold tracking-tight">{p.price}</p>
              <p className="mt-2 font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">{p.unit}</p>
              <p className="mt-6 leading-relaxed text-muted">{p.summary}</p>

              <ul className="mt-8 divide-y divide-line border-t border-line text-sm">
                {p.includes.map((line) => (
                  <li key={line} className="py-3 text-muted">{line}</li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-8 inline-block font-display text-sm font-semibold text-accent underline decoration-accent/40 decoration-1 underline-offset-[6px] transition hover:decoration-accent"
              >
                Check your date →
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4 grid gap-8 border-t border-line pt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-accent">Studio rental</p>
            <h3 className="mt-4 font-display text-3xl font-semibold">{site.studio.title}</h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">{site.studio.text}</p>
            <p className="mt-6 font-display text-3xl font-bold">
              {site.studio.price}
              <span className="ml-4 align-middle text-sm font-normal text-muted">{site.studio.note}</span>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 self-start text-sm">
            {site.studio.features.map((f) => (
              <li key={f} className="border-b border-line py-3 text-muted">{f}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
