import { awards } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** Recognition, set as a year-led list. */
export default function Awards() {
  return (
    <section aria-label="Recognition" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">Recognition</p>
        <ul className="mt-8 divide-y divide-line border-t border-line">
          {awards.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={i * 0.04}>
                <div className="grid gap-2 py-6 sm:grid-cols-[6rem_1fr_1.2fr] sm:gap-10">
                  <span className="font-display text-sm text-accent">{a.year}</span>
                  <h3 className="font-display text-lg font-medium leading-snug">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{a.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
