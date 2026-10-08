'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects } from '@/content/site';

/** Each shoot gets a full-height snap panel with its cover behind the type. */
export default function WorkReel() {
  return (
    <section id="work" className="snap-y snap-mandatory">
      {projects.map((p, i) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          className="group relative flex h-[100svh] snap-start items-end overflow-hidden"
        >
          {p.cover && (
            <SafeImage
              src={p.cover.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority={i === 0}
              placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={p.cover.blurDataURL}
              className="object-cover transition-transform duration-[1.4s] group-hover:scale-105"
              gradient={p.gradient}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 sm:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
                {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {p.category}
              </p>
              <h3 className="mt-4 font-display text-[12vw] font-bold leading-[0.9] tracking-tighter sm:text-[8vw] lg:text-[6.5rem]">
                {p.title}
              </h3>
              <p className="mt-5 max-w-xl text-lg text-white/70">{p.summary}</p>
              <span className="mt-8 inline-flex items-center gap-3 font-display text-sm font-semibold text-accent">
                {p.location} · {p.year}
                <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
              </span>
            </motion.div>
          </div>
        </Link>
      ))}
    </section>
  );
}
