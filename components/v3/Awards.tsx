import { awards } from '@/content/site';

/** Recognition, run as a single moving line of credits. */
export default function Awards() {
  const row = [...awards, ...awards];
  return (
    <section aria-label="Recognition" className="overflow-hidden py-14">
      <p className="mb-7 text-center font-display text-xs uppercase tracking-[0.3em] text-muted">Recognition</p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
          {row.map((a, i) => (
            <span key={i} className="flex items-baseline gap-4 whitespace-nowrap">
              <span className="font-display text-sm text-accent">{a.year}</span>
              <span className="font-display text-2xl font-medium text-white/60">{a.title}</span>
              <span aria-hidden className="text-white/20">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
