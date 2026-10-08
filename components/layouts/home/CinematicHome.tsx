'use client';
import { motion } from 'framer-motion';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import Navbar from '@/components/sections/Navbar';
import HeroVideo from '@/components/sections/HeroVideo';
import WorkReel from '@/components/work/WorkReel';
import Stats from '@/components/sections/Stats';
import Services from '@/components/sections/Services';
import Packages from '@/components/sections/Packages';
import Team from '@/components/sections/Team';
import Awards from '@/components/sections/Awards';
import Reviews from '@/components/sections/Reviews';
import Faq from '@/components/sections/Faq';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

/** Showreel hero, then every shoot as its own full-height snap panel. */
export default function CinematicHome() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <>
      <Navbar />
      <main>
        <section id="top" className="relative isolate flex h-[100svh] items-center justify-center overflow-hidden">
          <HeroVideo />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="font-display text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
            >
              {site.hero.badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-display text-[12vw] font-bold leading-[0.9] tracking-tighter sm:text-[7.5vw] lg:text-[6.5rem]"
            >
              {name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}
              className="mx-auto mt-8 max-w-xl text-lg text-white/70"
            >
              {site.tagline} {site.location}.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60"
          >
            Scroll
            <span className="relative h-12 w-px overflow-hidden bg-white/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-accent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
            </span>
          </motion.div>
        </section>

        <WorkReel />

        <Stats />
        <Services />
        <Packages />
        <Team />
        <Awards />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
