'use client';
import { motion } from 'framer-motion';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import MagneticButton from '@/components/ui/MagneticButton';

/**
 * Version 2 opens on type alone: no cover photo, no video, nothing to wait
 * for. The studio name is the only headline, set as large as the measure
 * allows, with the facts underneath as a ruled strip.
 */
export default function Hero() {
  const { brand } = usePreview();
  const name = brand.name || site.name;
  const [first, ...rest] = name.split(' ');

  const facts = [
    ['Founded', site.founded],
    ['Based', site.location.replace(/^Studio in /, '').split(' · ')[0]],
    ['Shooting', 'India & destination'],
    ['Booking', '2026 & 2027'],
  ];

  return (
    <section id="top" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 pb-16 pt-20 sm:px-10 sm:pb-24 sm:pt-28">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display text-[0.7rem] uppercase tracking-[0.3em] text-accent"
        >
          {site.hero.badge}
        </motion.p>

        <h1 className="mt-10 font-display text-[16vw] font-bold leading-[0.82] tracking-[-0.04em] sm:text-[12vw] lg:text-[10.5rem]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {first}
            </motion.span>
          </span>
          {rest.length > 0 && (
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block text-outline"
              >
                {rest.join(' ')}
              </motion.span>
            </span>
          )}
        </h1>

        <div className="mt-14 grid gap-12 border-t border-line pt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl text-xl leading-relaxed text-muted sm:text-2xl sm:leading-relaxed"
          >
            {site.hero.intro}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="grid grid-cols-2 gap-x-8 gap-y-6 self-start"
          >
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">{k}</dt>
                <dd className="mt-1.5 font-display text-base">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-14 flex flex-wrap gap-4"
        >
          <MagneticButton href={site.hero.ctaPrimary.href}>
            {site.hero.ctaPrimary.label} <span aria-hidden>↘</span>
          </MagneticButton>
          <MagneticButton href={site.hero.ctaSecondary.href} variant="ghost">
            {site.hero.ctaSecondary.label}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
