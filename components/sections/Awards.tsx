import { awards } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

export default function Awards() {
  return (
    <section aria-label="Recognition" className="border-y border-line bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.25em] text-muted">Recognition</p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={i * 0.05}>
                <p className="font-display text-sm text-accent">{a.year}</p>
                <p className="mt-2 font-display text-base font-medium leading-snug">{a.title}</p>
                <p className="mt-1 text-sm text-muted">{a.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
