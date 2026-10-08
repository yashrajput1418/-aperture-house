'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { projects, type Project } from '@/content/site';
import type { MediaImage } from '@/content/media';

type Tile = { img: MediaImage; project: Project; key: string };

/**
 * Archive view: every frame the studio has, filterable by shoot type.
 * Each tile links through to the case study it came from.
 */
export default function WorkArchive() {
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], []);
  const [filter, setFilter] = useState('All');

  const tiles = useMemo(() => {
    const out: Tile[] = [];
    const pool = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
    // interleave so one shoot never forms a solid block
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
    <section id="work" className="px-6 py-16 sm:px-10">
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filter === c ? 'border-accent bg-accent text-ink' : 'border-line text-muted hover:border-white/30 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {tiles.map((t, i) => (
          <motion.div
            key={t.key}
            layout
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: Math.min(i, 12) * 0.02 }}
            className="break-inside-avoid"
          >
            <Link
              href={`/work/${t.project.slug}`}
              className="group relative block overflow-hidden rounded-xl border border-line"
            >
              <SafeImage
                src={t.img.src}
                alt={`${t.project.title} — ${t.img.alt ?? 'frame'}`}
                width={t.img.width}
                height={t.img.height}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                placeholder={t.img.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={t.img.blurDataURL}
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                gradient={t.project.gradient}
                placeholderLabel={t.project.title}
                placeholderClassName="aspect-[4/3]"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span>
                  <span className="block font-display text-sm font-semibold">{t.project.title}</span>
                  <span className="block text-xs text-muted">{t.project.category}</span>
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
