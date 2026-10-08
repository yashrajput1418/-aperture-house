import { services } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** Numbered rows, the running order of what the studio shoots. */
export default function Services() {
  return (
    <section id="services" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">What we shoot</h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            One team on camera, one on film. Everything below can be booked on its own.
          </p>
        </div>

        <ol className="divide-y divide-line">
          {services.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.04}>
                <div className="grid gap-3 py-9 sm:grid-cols-[3.5rem_1fr_1.4fr] sm:gap-10">
                  <span className="font-display text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl font-semibold leading-tight sm:text-4xl">{s.title}</h3>
                  <p className="max-w-xl leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
