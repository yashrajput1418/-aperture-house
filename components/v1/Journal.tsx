import { journal } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

export default function Journal() {
  return (
    <section id="journal" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
      <SectionHeading eyebrow="Journal" title={<>Notes from <span className="text-outline">the</span> shoots</>} />
      <ul className="mt-14 divide-y divide-line border-y border-line">
        {journal.map((j, i) => (
          <li key={j.title}>
            <Reveal delay={i * 0.04}>
              <a href="#" className="group flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:gap-10">
                <span className="shrink-0 font-display text-xs uppercase tracking-[0.2em] text-accent sm:w-40">
                  {j.category}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl font-medium transition-colors group-hover:text-accent sm:text-2xl">
                    {j.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-muted">{j.excerpt}</span>
                </span>
                <span className="shrink-0 text-sm text-muted sm:text-right">
                  {j.date}
                  <span className="block">{j.readingTime}</span>
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
