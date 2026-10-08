'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { stats } from '@/content/site';

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: setN });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{n.toFixed(decimals)}</span>;
}

/** A single full-bleed band of counters between panels — a title card. */
export default function Stats() {
  return (
    <section
      aria-label="The studio in numbers"
      className="relative flex min-h-[70svh] items-center overflow-hidden border-y border-line"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(90_95_216/0.22),transparent_65%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 py-20 text-center sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-6xl font-bold tracking-tight sm:text-7xl">
              <Counter value={s.value} decimals={s.decimals} />
              <span className="text-accent">{s.suffix}</span>
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
