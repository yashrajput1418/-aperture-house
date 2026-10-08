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

export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-ink p-8 sm:p-10">
            <p className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
              <Counter value={s.value} decimals={s.decimals} />
              <span className="text-accent">{s.suffix}</span>
            </p>
            <p className="mt-3 text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
