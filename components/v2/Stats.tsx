import { stats } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** Version 2 sets the numbers as a ruled strip — no boxes, no counting up. */
export default function Stats() {
  return (
    <section aria-label="The studio in numbers" className="border-b border-line">
      <dl className="mx-auto grid max-w-[90rem] divide-line px-6 sm:px-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className="py-10 lg:px-10 lg:first:pl-0 lg:last:pr-0">
            <dt className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">{s.label}</dt>
            <dd className="mt-4 font-display text-6xl font-bold tracking-tight sm:text-7xl">
              {s.decimals ? s.value.toFixed(s.decimals) : s.value.toLocaleString('en-IN')}
              <span className="text-accent">{s.suffix}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
