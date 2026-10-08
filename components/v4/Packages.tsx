import { packages, site } from '@/content/site';

/**
 * A price list, not a set of cards: one dense table on wide screens, the
 * same data stacked on phones.
 */
export default function Packages() {
  return (
    <section id="packages" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">Price list</h2>
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          Starting prices, not quotes. Tell us your date and you get a real number the same day.
        </p>
      </div>

      <div className="mt-8 border border-line">
        {packages.map((p, i) => (
          <div
            key={p.name}
            className={`grid gap-4 p-5 sm:grid-cols-[14rem_9rem_1fr] sm:gap-8 sm:p-6 ${
              i > 0 ? 'border-t border-line' : ''
            } ${p.popular ? 'bg-accent/[0.04]' : ''}`}
          >
            <div>
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              {p.popular && (
                <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-accent">Most booked</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted sm:max-w-[13rem]">{p.summary}</p>
            </div>

            <div>
              <p className="font-display text-2xl font-bold text-accent">{p.price}</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted">{p.unit}</p>
              <a
                href="#contact"
                className="mt-4 inline-block border border-line px-3.5 py-2 font-display text-xs transition hover:border-accent hover:text-accent"
              >
                Check date
              </a>
            </div>

            <ul className="grid gap-x-8 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
              {p.includes.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span aria-hidden className="text-accent">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="grid gap-4 border-t border-line bg-ink-2/50 p-5 sm:grid-cols-[14rem_9rem_1fr] sm:gap-8 sm:p-6">
          <div>
            <h3 className="font-display text-lg font-semibold">Studio only</h3>
            <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-accent">Hourly rental</p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:max-w-[13rem]">{site.studio.text}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-accent">{site.studio.price}</p>
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted">{site.studio.note}</p>
          </div>
          <ul className="grid gap-x-8 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
            {site.studio.features.map((f) => (
              <li key={f} className="flex gap-2.5">
                <span aria-hidden className="text-accent">·</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
