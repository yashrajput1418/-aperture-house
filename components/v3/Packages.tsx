'use client';
import { motion } from 'framer-motion';
import { packages, site } from '@/content/site';

/**
 * Packages as full-width rows: price set large on the left, inclusions on
 * the right, the whole row lighting up on hover.
 */
export default function Packages() {
  return (
    <section id="packages" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Packages</p>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-6xl">What it costs</h2>
        <p className="mt-5 max-w-lg text-muted">
          Starting prices, not quotes. Tell us your date and you get a real number the same day.
        </p>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative"
            >
              <div className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-accent/[0.05] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="relative grid gap-8 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="font-display text-3xl font-semibold sm:text-4xl">{p.name}</h3>
                    {p.popular && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
                        Most booked
                      </span>
                    )}
                  </div>
                  <p className="mt-6 font-display text-6xl font-bold tracking-tight text-accent sm:text-7xl">
                    {p.price}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">{p.unit}</p>
                  <p className="mt-6 max-w-md leading-relaxed text-muted">{p.summary}</p>
                  <a
                    href="#contact"
                    className="mt-8 inline-block rounded-full border border-line px-6 py-3 font-display text-sm font-semibold transition group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
                  >
                    Check your date
                  </a>
                </div>
                <ul className="grid gap-x-10 gap-y-3 self-center sm:grid-cols-2">
                  {p.includes.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-muted">
                      <span aria-hidden className="text-accent">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* studio rental, framed like a trailer card */}
        <div className="mt-16 overflow-hidden rounded-[2rem] border border-line bg-ink-2">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Studio rental</p>
              <h3 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{site.studio.title}</h3>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">{site.studio.text}</p>
              <p className="mt-7 font-display text-4xl font-bold text-accent">{site.studio.price}</p>
              <p className="mt-2 text-sm text-muted">{site.studio.note}</p>
            </div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 self-center text-sm text-muted">
              {site.studio.features.map((f) => (
                <li key={f} className="border-b border-line pb-3">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
