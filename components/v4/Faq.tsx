import { faqs } from '@/content/site';

/**
 * Plain `<details>` rows: they open without JavaScript, they are findable
 * with the browser's own find-in-page, and they suit a reference page.
 */
export default function Faq() {
  return (
    <section id="faq" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">Questions</h2>
      <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
        {faqs.map((f, i) => (
          <details key={f.q} className="group bg-ink p-5" open={i < 2}>
            <summary className="flex cursor-pointer list-none items-start gap-3 font-display text-base font-medium leading-snug [&::-webkit-details-marker]:hidden">
              <span className="text-[0.6rem] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1">{f.q}</span>
              <span aria-hidden className="text-accent transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-4 pl-7 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
