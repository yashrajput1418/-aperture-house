import { faqs } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/**
 * Nothing to click: every answer is already on the page, set as a
 * question-and-answer column. Accordions hide text that people came to read.
 */
export default function Faq() {
  return (
    <section id="faq" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              The honest answers
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-muted">
              Everything couples ask us on the first call, written down so you do not have to ask.
            </p>
          </div>

          <dl className="divide-y divide-line border-y border-line">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.03}>
                <div className="grid gap-3 py-8 sm:grid-cols-[1fr_1.3fr] sm:gap-10">
                  <dt className="font-display text-lg font-medium leading-snug sm:text-xl">{f.q}</dt>
                  <dd className="leading-relaxed text-muted">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
