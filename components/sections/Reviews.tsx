'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reviews } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1 text-lg" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= n ? 'text-accent' : 'text-white/15'}>★</span>)}
    </div>
  );
}

export default function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = reviews.length;
  const go = (d: number) => setI((v) => (v + d + total) % total);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);

  return (
    <section id="reviews" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(124_92_255/0.18),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow="Client reviews" title="Words from people we've built with" />
          <div className="text-right">
            <p className="font-display text-6xl font-bold">{avg}<span className="text-accent">★</span></p>
            <p className="text-muted">average from {total} reviews</p>
          </div>
        </div>

        <div
          className="relative mt-16 h-[420px] [perspective:1400px] sm:h-[380px]"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        >
          {reviews.map((r, idx) => {
            // position relative to the active card: 0 = front, 1 = next, -1 = previous
            let pos = idx - i;
            if (pos > total / 2) pos -= total;
            if (pos < -total / 2) pos += total;
            const visible = Math.abs(pos) <= 1;
            return (
              <motion.article
                key={idx}
                initial={false}
                animate={{
                  x: `${pos * 78}%`,
                  rotateY: pos * -32,
                  scale: pos === 0 ? 1 : 0.8,
                  opacity: visible ? (pos === 0 ? 1 : 0.25) : 0,
                  filter: pos === 0 ? 'blur(0px)' : 'blur(3px)',
                }}
                style={{ zIndex: 10 - Math.abs(pos), pointerEvents: visible ? 'auto' : 'none' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => pos !== 0 && go(pos)}
                className={`absolute inset-x-0 top-0 mx-auto w-[88%] max-w-xl rounded-3xl border border-line bg-ink-2 p-8 sm:p-10 ${pos === 0 ? '' : 'cursor-pointer'}`}
              >
                <Stars n={r.rating} />
                <p className="mt-6 font-display text-xl leading-snug sm:text-2xl">&ldquo;{r.quote}&rdquo;</p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet to-accent font-display font-bold text-ink">
                    {r.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-semibold">{r.name} <span aria-hidden>{r.country}</span></p>
                    <p className="text-sm text-muted">{r.role} · {r.project}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous review" className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent">←</button>
          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Review ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-accent' : 'w-3 bg-white/20'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next review" className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition hover:border-accent hover:text-accent">→</button>
        </div>
      </div>
    </section>
  );
}
