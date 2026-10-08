import { services } from '@/content/site';

/** Shoot types as a bordered grid of cells — a catalogue page. */
export default function Services() {
  return (
    <section id="services" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">What we shoot</h2>
      <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <article key={s.title} className="group bg-ink p-6 transition-colors hover:bg-ink-2">
            <div className="flex items-start justify-between gap-4">
              <span className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xl text-accent">{s.icon}</span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold leading-snug">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
            <a
              href="#contact"
              className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-accent opacity-0 transition-opacity group-hover:opacity-100"
            >
              Enquire →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
