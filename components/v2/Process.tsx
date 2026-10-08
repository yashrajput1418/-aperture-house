import { process } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** Four steps as a two-column ruled grid — a schedule, not a timeline. */
export default function Process() {
  return (
    <section id="process" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          From the first message to the album
        </h2>

        <div className="mt-14 grid border-t border-line sm:grid-cols-2">
          {process.map((p, i) => (
            <Reveal
              key={p.step}
              delay={i * 0.05}
              className={`border-b border-line py-10 sm:py-12 ${i % 2 === 0 ? 'sm:border-r sm:pr-12' : 'sm:pl-12'}`}
            >
              <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-accent">Step {p.step}</p>
              <h3 className="mt-5 font-display text-3xl font-semibold">{p.title}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
