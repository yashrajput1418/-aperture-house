import { clients } from '@/content/site';

export default function Marquee() {
  const row = [...clients, ...clients];
  return (
    <section aria-label="Venues and brands" className="relative border-y border-line py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-muted">Venues & brands we shoot at</p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <span key={i} className="font-display text-3xl font-semibold text-white/30 transition-colors hover:text-white">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
