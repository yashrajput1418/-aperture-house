'use client';
import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { process } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });

  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
      <SectionHeading eyebrow="How we work" title="From idea to launch in four steps" />
      <div ref={ref} className="relative mt-16 pl-10 sm:pl-16">
        {/* the line draws itself as you scroll */}
        <div className="absolute bottom-0 left-3 top-0 w-px bg-line sm:left-6" />
        <motion.div style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-3 top-0 w-px origin-top bg-accent sm:left-6" />
        <div className="space-y-16">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.05} className="relative">
              <span className="absolute -left-[33px] top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)] sm:-left-[45px]" />
              <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:gap-10">
                <span className="font-display text-5xl font-bold text-white/15">{p.step}</span>
                <div>
                  <h3 className="font-display text-3xl font-semibold">{p.title}</h3>
                  <p className="mt-3 max-w-xl text-lg text-muted">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
