'use client';
import { motion } from 'framer-motion';
import HeroCanvas from '@/components/three/HeroCanvas';
import HeroVideo from '@/components/sections/HeroVideo';
import HeroCollage from '@/components/sections/HeroCollage';
import MagneticButton from '@/components/ui/MagneticButton';
import { site } from '@/content/site';

const word = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const { mode, badge, headline, headlineAccent, headlineOutline, intro, ctaPrimary, ctaSecondary } = site.hero;
  const showCollage = mode === 'collage';
  const showVideo = mode === 'video' || mode === 'both';
  const show3d = mode === '3d' || mode === 'both';
  let n = 0; // running word index, so the stagger continues across lines

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28">
      {showCollage && <HeroCollage />}
      {showVideo && <HeroVideo />}

      {/* background glow + grid */}
      {!showCollage && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(90_95_216/0.22),transparent_60%)]" />
      )}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {show3d && (
        <div className="pointer-events-auto absolute inset-0 z-[1] md:left-[35%]">
          <HeroCanvas />
        </div>
      )}

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-sm text-muted backdrop-blur"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> {badge}
        </motion.p>

        <h1 className="font-display text-[9.5vw] font-bold leading-[0.95] tracking-tighter sm:text-[8.5vw] sm:leading-[0.92] lg:text-[8rem]">
          {headline.map((line, li) => (
            <span key={li} className="flex flex-wrap gap-x-[0.25em]">
              {line.map((w) => {
                const i = n++;
                const accent = headlineAccent.includes(w);
                const outline = headlineOutline.includes(w);
                return (
                  <span key={`${li}-${w}-${i}`} className="-mb-[0.14em] overflow-hidden pb-[0.14em]">
                    <motion.span
                      className={`inline-block ${accent ? 'text-accent' : outline ? 'text-outline' : ''}`}
                      variants={word} initial="hidden" animate="show" custom={i}
                    >
                      {w}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 max-w-md text-lg text-muted"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="pointer-events-auto mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href={ctaPrimary.href}>{ctaPrimary.label} <span aria-hidden>↘</span></MagneticButton>
          <MagneticButton href={ctaSecondary.href} variant="ghost">{ctaSecondary.label}</MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted sm:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-accent" animate={{ y: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} />
        </span>
      </motion.div>
    </section>
  );
}
