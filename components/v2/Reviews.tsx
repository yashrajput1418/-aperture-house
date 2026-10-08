import { reviews } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/**
 * No carousel here — the quotes are simply printed, largest first, the way
 * a magazine runs its letters page. Nothing moves, nothing auto-advances.
 */
export default function Reviews() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">What they said</h2>
          <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
            {avg}★ average · {reviews.length} reviews
          </p>
        </div>

        {/* the first quote runs large, the rest in two columns */}
        <Reveal>
          <blockquote className="py-12">
            <p className="max-w-5xl font-display text-3xl font-medium leading-[1.25] tracking-tight sm:text-5xl sm:leading-[1.15]">
              &ldquo;{reviews[0].quote}&rdquo;
            </p>
            <footer className="mt-8 font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
              {reviews[0].name} <span aria-hidden>{reviews[0].country}</span>
              <span className="mx-3 text-accent">/</span>
              {reviews[0].role} · {reviews[0].project}
            </footer>
          </blockquote>
        </Reveal>

        <ul className="grid border-t border-line sm:grid-cols-2">
          {reviews.slice(1).map((r, i) => (
            <li
              key={r.name + r.project}
              className={`border-b border-line py-10 sm:py-12 ${i % 2 === 0 ? 'sm:border-r sm:pr-12' : 'sm:pl-12'}`}
            >
              <Reveal delay={(i % 2) * 0.05}>
                <blockquote>
                  <p className="text-lg leading-relaxed text-white/85">&ldquo;{r.quote}&rdquo;</p>
                  <footer className="mt-6 font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                    {r.name} <span aria-hidden>{r.country}</span>
                    <span className="mx-3 text-accent">/</span>
                    {r.project}
                    <span className="ml-3 text-accent" aria-label={`${r.rating} out of 5`}>
                      {'★'.repeat(r.rating)}
                    </span>
                  </footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
