'use client';
import { useMemo, useRef } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { projects } from '@/content/site';
import type { MediaImage } from '@/content/media';
import { useMediaPolicy } from '@/lib/useMediaPolicy';

type Tile = { kind: 'image'; img: MediaImage; key: string } | { kind: 'video'; src: string; poster?: string; key: string };

const COLUMNS = 7;
/** Seconds for one full loop, per column — uneven on purpose. */
const SPEEDS = [48, 62, 40, 70, 54, 58, 44];
/** 3 columns on phones, 5 from md, all 7 from lg. */
const COLUMN_VISIBILITY = ['', '', '', 'hidden md:block', 'hidden md:block', 'hidden lg:block', 'hidden lg:block'];

/**
 * Full-bleed hero background: columns of the studio's own shoots drifting
 * vertically at different speeds, like a contact sheet that never stops.
 *
 * - drifts with the mouse and with page scroll
 * - a few tiles play muted video where the connection allows it
 * - frozen flat under prefers-reduced-motion
 */
export default function HeroCollage() {
  const policy = useMediaPolicy();
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  // every frame the studio has, interleaved so one shoot never clumps
  const columns = useMemo(() => {
    const images: MediaImage[] = [];
    const maxLen = Math.max(0, ...projects.map((p) => (p.gallery?.length ?? 0) + (p.cover ? 1 : 0)));
    for (let i = 0; i < maxLen; i++) {
      for (const p of projects) {
        const frames = [p.cover, ...(p.gallery ?? [])].filter(Boolean) as MediaImage[];
        if (frames[i]) images.push(frames[i]);
      }
    }

    const videos = projects.map((p) => p.video).filter(Boolean);
    const tiles: Tile[] = images.map((img, i) => ({ kind: 'image', img, key: `i${i}` }));

    // drop a video tile into every 7th slot
    if (policy.allowBackgroundVideo) {
      videos.forEach((v, i) => {
        const at = Math.min(tiles.length, 3 + i * 7);
        tiles.splice(at, 0, { kind: 'video', src: v!.src, poster: v!.poster, key: `v${i}` });
      });
    }

    const cols: Tile[][] = Array.from({ length: COLUMNS }, () => []);
    tiles.forEach((t, i) => cols[i % COLUMNS].push(t));
    return cols.filter((c) => c.length);
  }, [policy.allowBackgroundVideo]);

  // mouse parallax — the whole sheet leans towards the cursor
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * -56);
    my.set(((e.clientY - r.top) / r.height - 0.5) * -36);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  // scroll parallax — the sheet keeps moving as the page leaves
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end start'] });
  const scrollY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  if (!columns.length) return null;

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="pointer-events-auto absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div style={{ y: scrollY, scale: scrollScale }} className="absolute inset-0">
        <motion.div
          style={{ x: mx, y: my }}
          className="absolute -inset-x-[10%] -inset-y-[18%] grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-5 lg:grid-cols-7"
        >
          {columns.map((col, ci) => {
            const up = ci % 2 === 0;
            const duration = SPEEDS[ci % SPEEDS.length];
            // doubled so the loop seam never shows
            const loop = [...col, ...col];
            return (
              <div key={ci} className={`relative ${COLUMN_VISIBILITY[ci] ?? ''}`}>
                <div
                  className="flex flex-col gap-2.5 sm:gap-3"
                  style={
                    reduce
                      ? undefined
                      : {
                          animation: `collage-${up ? 'up' : 'down'} ${duration}s linear infinite`,
                          willChange: 'transform',
                        }
                  }
                >
                  {loop.map((t, ti) => (
                    <div
                      key={`${t.key}-${ti}`}
                      className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-ink-2"
                    >
                      {t.kind === 'image' ? (
                        <SafeImage
                          src={t.img.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 15vw, (min-width: 768px) 20vw, 34vw"
                          placeholder={t.img.blurDataURL ? 'blur' : 'empty'}
                          blurDataURL={t.img.blurDataURL}
                          className="object-cover"
                          priority={ti < 2}
                          placeholderMarkClassName="h-6 w-6"
                        />
                      ) : (
                        <video
                          src={t.src}
                          poster={t.poster}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="none"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* readability: a flat scrim, then a darker pocket under the headline.
          Keep the stack light — each layer multiplies with the one above it. */}
      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-transparent to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_26%_52%,rgb(10_10_12/0.8),transparent_70%)]" />
    </div>
  );
}
