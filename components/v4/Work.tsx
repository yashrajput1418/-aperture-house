'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects, type Project } from '@/content/site';
import type { MediaImage } from '@/content/media';
import { workHref } from '@/lib/version';

type Tile = { img: MediaImage; project: Project; key: string };

/**
 * Every frame the studio has, filterable by shoot type. Tiles are
 * interleaved between shoots so one wedding never forms a solid block.
 */
export default function Work() {
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], []);
  const [filter, setFilter] = useState('All');

  const tiles = useMemo(() => {
    const out: Tile[] = [];
    const pool = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
    const max = Math.max(0, ...pool.map((p) => 1 + (p.gallery?.length ?? 0)));
    for (let i = 0; i < max; i++) {
      for (const p of pool) {
        const frames = [p.cover, ...(p.gallery ?? [])].filter(Boolean) as MediaImage[];
        if (frames[i]) out.push({ img: frames[i], project: p, key: `${p.slug}-${i}` });
      }
    }
    return out;
  }, [filter]);

  return (
    <section id="work" className="border-b border-line">
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line bg-ink/90 px-5 py-3 backdrop-blur sm:px-8 lg:top-0">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted">
          {tiles.length} frames
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`font-display text-sm transition ${
                filter === c ? 'text-accent underline decoration-accent/50 underline-offset-4' : 'text-muted hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-2 gap-px bg-line sm:columns-3 lg:columns-4 [&>*]:mb-px">
        {tiles.map((t, i) => (
          <motion.div
            key={t.key}
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.015 }}
            className="break-inside-avoid bg-ink"
          >
            <Link href={workHref(4, t.project.slug)} className="group relative block overflow-hidden">
              <SafeImage
                src={t.img.src}
                alt={`${t.project.title} — ${t.img.alt ?? 'frame'}`}
                width={t.img.width}
                height={t.img.height}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                placeholder={t.img.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={t.img.blurDataURL}
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                gradient={t.project.gradient}
                placeholderLabel={t.project.title}
                placeholderClassName="aspect-[4/3]"
              />
              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <span className="font-display text-sm font-semibold">{t.project.title}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-accent">
                  {t.project.category} · {t.project.year}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
