'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { site } from '@/content/site';
import BrandMark from '@/components/preview/BrandMarks';
import { usePreview } from '@/lib/preview';
import { useScrollLock } from '@/lib/scrollLock';

/**
 * Full-screen loader shown until the page has actually finished loading —
 * `window.load`, which fires after the stylesheets, fonts, hero images and
 * any poster frames in the initial markup are done.
 *
 * Safety rails:
 *  - a hard timeout always reveals the site, so a single slow asset can
 *    never strand a visitor on the loader
 *  - a minimum duration stops it flashing for a fraction of a second on a
 *    warm cache
 *  - under `prefers-reduced-motion` it skips the animation and just goes
 *  - with JavaScript off it is hidden by a <noscript> rule in the layout,
 *    so the site is never gated behind a script that will not run
 */
export default function SiteLoader() {
  const reduce = useReducedMotion();
  const { brand } = usePreview();
  const brandName = brand.name || site.name;
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!site.loader.enabled) {
      setVisible(false);
      return;
    }

    const startedAt = Date.now();
    let settled = false;
    let creep = 0;
    let bail = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearInterval(creep);
      setProgress(100);
      const waited = Date.now() - startedAt;
      const hold = Math.max(site.loader.minMs - waited, 0);
      window.setTimeout(() => setVisible(false), reduce ? 0 : hold + 260);
    };

    /**
     * Wait for what the visitor is about to look at, NOT for `window.load`.
     * `window.load` blocks on every image in the document — including the
     * case-study gallery far below the fold — which can hold the loader for
     * many seconds on a cold cache. Above-the-fold images plus web fonts are
     * what actually decide whether the first screen looks finished.
     */
    const settleWhenReady = async () => {
      // let the first paint put the images in the DOM
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const nearFold = Array.from(document.images).filter((img) => {
        const r = img.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight * 1.25;
      });

      let done = 0;
      const total = nearFold.length || 1;
      const tick = () => {
        done += 1;
        if (!settled) setProgress((prev) => Math.max(prev, 12 + (done / total) * 80));
      };

      const images = nearFold.map((img) =>
        img.complete
          ? (tick(), Promise.resolve())
          : new Promise<void>((res) => {
              const on = () => { tick(); res(); };
              img.addEventListener('load', on, { once: true });
              img.addEventListener('error', on, { once: true });
            })
      );

      const fonts = document.fonts?.ready ?? Promise.resolve();

      /**
       * If an autoplaying background video is already mounted, give it a brief
       * moment to buffer its first frame so the hero does not pop.
       *
       * Two rules keep this from stalling the loader:
       *  - only `[autoplay]` videos count. A click-to-play film is `preload="none"`,
       *    so it is not fetching anything and `loadeddata` would never fire.
       *  - it races a short timeout, so a slow video delays the reveal by at most
       *    that long rather than holding it to the hard ceiling.
       */
      const video = document.querySelector<HTMLVideoElement>('video[autoplay]');
      const firstFrame =
        !video || video.readyState >= 2
          ? Promise.resolve()
          : Promise.race([
              new Promise<void>((res) => {
                video.addEventListener('loadeddata', () => res(), { once: true });
                video.addEventListener('error', () => res(), { once: true });
              }),
              new Promise<void>((res) => window.setTimeout(res, 1200)),
            ]);

      await Promise.all([...images, fonts, firstFrame]);
      finish();
    };

    // keep the bar alive while we wait
    creep = window.setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + Math.max(0.5, (92 - prev) * 0.04)));
    }, 110);

    // never strand the visitor, whatever happens above
    bail = window.setTimeout(finish, site.loader.maxMs);
    void settleWhenReady();

    return () => {
      window.clearInterval(creep);
      window.clearTimeout(bail);
    };
  }, [reduce]);

  // hold the page still while the loader is up (Lenis included)
  useScrollLock(visible);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="site-loader"
          key="loader"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
          transition={{ duration: reduce ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${brandName}`}
        >
          {/* the mark opens like an iris as it loads */}
          <motion.div
            initial={reduce ? false : { scale: 0.82, opacity: 0 }}
            animate={reduce ? undefined : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
            >
              <BrandMark className="h-16 w-16 text-accent" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 -z-10 scale-[2.2] rounded-full bg-accent/10 blur-2xl" />
          </motion.div>

          <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            {brandName}
          </p>

          <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
          <p className="mt-3 font-display text-xs tabular-nums text-muted">{Math.round(progress)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
