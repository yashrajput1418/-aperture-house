import { journal } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** The journal as a contents page: date, category, title, length. */
export default function Journal() {
  return (
    <section id="journal" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Journal</h2>
          <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
            Notes from the shoots
          </p>
        </div>

        <ul className="divide-y divide-line">
          {journal.map((j, i) => (
            <li key={j.title}>
              <Reveal delay={i * 0.04}>
                <a
                  href="#"
                  className="group grid gap-2 py-7 sm:grid-cols-[7rem_1fr_9rem] sm:items-baseline sm:gap-10"
                >
                  <span className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                    {j.category}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-medium transition-colors group-hover:text-accent sm:text-3xl">
                      {j.title}
                    </span>
                    <span className="mt-2 block max-w-2xl leading-relaxed text-muted">{j.excerpt}</span>
                  </span>
                  <span className="text-sm text-muted sm:text-right">
                    {j.date}
                    <span className="block">{j.readingTime}</span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
