'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects, type Project } from '@/content/site';
import { workHref } from '@/lib/version';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectVisual from '@/components/ui/ProjectVisual';

function Card({ p, i, priority }: { p: Project; i: number; priority: boolean }) {
  return (
    <Link href={workHref(1, p.slug)} className="group block w-[85vw] shrink-0 sm:w-[60vw] lg:w-[46vw]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-ink-2">
        <ProjectVisual p={p} priority={priority} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
        <span className="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium backdrop-blur">{p.category}</span>
        <span className="absolute right-5 top-5 font-display text-sm text-white/70">{String(i + 1).padStart(2, '0')}</span>
        <span className="absolute bottom-5 left-5 text-sm text-white/70">{p.location} · {p.year}</span>
        <span className="absolute bottom-5 right-5 flex h-14 w-14 scale-0 items-center justify-center rounded-full bg-accent text-xl text-ink transition-transform duration-500 group-hover:scale-100">↗</span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">{p.title}</h3>
          <p className="mt-1 text-muted">{p.summary}</p>
        </div>
        <span className="shrink-0 rounded-full border border-accent/40 px-3 py-1 text-sm text-accent">{p.result}</span>
      </div>
    </Link>
  );
}

export default function Work() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((projects.length - 1) * 100) / projects.length}%`]);

  return (
    <section id="work">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-32 sm:px-10">
        <SectionHeading eyebrow="Recent shoots" title={<>Days we were <span className="text-outline">lucky</span> to shoot</>} />
      </div>

      {/* desktop: pinned horizontal scroll */}
      <div ref={target} className="relative hidden md:block" style={{ height: `${projects.length * 70}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-10 pl-10">
            {projects.map((p, i) => <Card key={p.slug} p={p} i={i} priority={i === 0} />)}
            <div className="w-[20vw] shrink-0" />
          </motion.div>
        </div>
      </div>

      {/* mobile: swipeable row */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:hidden [scrollbar-width:none]">
        {projects.map((p, i) => (
          <div key={p.slug} className="snap-center"><Card p={p} i={i} priority={i === 0} /></div>
        ))}
      </div>
    </section>
  );
}
