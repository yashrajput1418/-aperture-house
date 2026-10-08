'use client';
import { useRef } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MediaImage } from '@/content/media';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';

/** Full-width case-study cover that drifts slightly slower than the page. */
export default function ParallaxCover({
  image,
  gradient,
  title,
}: {
  image?: MediaImage;
  gradient: [string, string];
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%']);
  const [a, b] = gradient;

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-line"
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      {image ? (
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[12%] h-[124%]">
          <SafeImage
            src={image.src}
            alt={image.alt ? `${title} — ${image.alt}` : title}
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            placeholder={image.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={image.blurDataURL}
            className="object-cover"
            gradient={gradient}
            placeholderLabel={title}
            placeholderMarkClassName="h-14 w-14"
          />
        </motion.div>
      ) : (
        <MediaPlaceholder gradient={gradient} label={title} markClassName="h-14 w-14" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
    </div>
  );
}
