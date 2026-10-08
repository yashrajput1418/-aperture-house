import { awards } from '@/content/site';

/** Recognition as four cells of the same grid everything else uses. */
export default function Awards() {
  return (
    <section aria-label="Recognition" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted">Recognition</h2>
      <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((a) => (
          <li key={a.title} className="bg-ink p-5">
            <p className="font-display text-sm text-accent">{a.year}</p>
            <p className="mt-2 font-display text-base font-medium leading-snug">{a.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{a.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
