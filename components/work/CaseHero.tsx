'use client';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import type { MediaImage } from '@/content/media';

/**
 * Full-bleed opening frame for a case study: the cover fills the viewport
 * and drifts slower than the page, with the title set over the bottom.
 */
export default function CaseHero({
  image,
  gradient,
  title,
  eyebrow,
  summary,
}: {
  image?: MediaImage;
  gradient: [string, string];
  title: string;
  eyebrow: string;
  summary: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0]);

  return (
    <header ref={ref} className="relative isolate flex h-[92svh] min-h-[520px] items-end overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        {image ? (
          <SafeImage
            src={image.src}
            alt={image.alt ? `${title} — ${image.alt}` : title}
            fill
            priority
            sizes="100vw"
            placeholder={image.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={image.blurDataURL}
            className="object-cover"
            gradient={gradient}
            placeholderLabel={title}
            placeholderMarkClassName="h-16 w-16"
          />
        ) : (
          <MediaPlaceholder gradient={gradient} label={title} markClassName="h-16 w-16" />
        )}
      </motion.div>

      {/* keep the type legible over any frame */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_20%_90%,rgb(10_10_12/0.85),transparent_70%)]" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
          className="font-display text-xs uppercase tracking-[0.3em] text-accent sm:text-sm"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-[13vw] font-bold leading-[0.9] tracking-tighter sm:text-[9vw] lg:text-[7.5rem]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl"
        >
          {summary}
        </motion.p>
      </motion.div>
    </header>
  );
}
