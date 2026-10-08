import { journal } from '@/content/site';

/** Dense rows, like a file listing: category, title, date, length. */
export default function Journal() {
  return (
    <section id="journal" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">Journal</h2>
      <ul className="mt-8 border border-line">
        {journal.map((j, i) => (
          <li key={j.title} className={i > 0 ? 'border-t border-line' : ''}>
            <a
              href="#"
              className="group grid gap-1.5 p-4 sm:grid-cols-[7rem_1fr_6rem_5rem] sm:items-baseline sm:gap-6"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-accent">{j.category}</span>
              <span>
                <span className="block font-display text-base font-medium transition-colors group-hover:text-accent">
                  {j.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{j.excerpt}</span>
              </span>
              <span className="text-xs text-muted">{j.date}</span>
              <span className="text-xs text-muted sm:text-right">{j.readingTime}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
