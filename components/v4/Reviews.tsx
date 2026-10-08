import { reviews } from '@/content/site';

/**
 * All of the reviews at once, in a masonry column set. Nothing to advance:
 * the archive shows you everything it has.
 */
export default function Reviews() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">Client reviews</h2>
        <p className="font-display text-sm">
          <span className="text-accent">{avg}★</span>
          <span className="ml-2 text-muted">from {reviews.length} reviews</span>
        </p>
      </div>

      <div className="mt-8 columns-1 gap-px bg-line sm:columns-2 lg:columns-3 [&>*]:mb-px">
        {reviews.map((r) => (
          <article key={r.name + r.project} className="break-inside-avoid bg-ink p-5">
            <p className="text-accent" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}</p>
            <blockquote className="mt-4 text-sm leading-relaxed text-white/85">&ldquo;{r.quote}&rdquo;</blockquote>
            <p className="mt-5 border-t border-line pt-4 text-xs">
              <span className="font-semibold">{r.name}</span> <span aria-hidden>{r.country}</span>
              <span className="mt-1 block text-muted">{r.role} · {r.project}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
