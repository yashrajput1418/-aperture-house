import { journal } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** Three notes, set as cards you could flick through. */
export default function Journal() {
  return (
    <section id="journal" className="border-y border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Journal</p>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Notes from the shoots
            </h2>
          </div>
          <a href="#" className="font-display text-sm font-semibold text-accent">All notes →</a>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {journal.map((j, i) => (
            <Reveal key={j.title} delay={i * 0.06}>
              <a
                href="#"
                className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-line bg-ink-2 p-8 transition-colors hover:border-accent/50"
              >
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.25em] text-accent">{j.category}</p>
                  <h3 className="mt-6 font-display text-2xl font-semibold leading-snug transition-colors group-hover:text-accent">
                    {j.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">{j.excerpt}</p>
                </div>
                <p className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm text-muted">
                  <span>{j.date}</span>
                  <span>{j.readingTime}</span>
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
