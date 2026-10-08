'use client';
import { motion } from 'framer-motion';
import { site, services, stats } from '@/content/site';
import { usePreview } from '@/lib/preview';
import Navbar from '@/components/sections/Navbar';
import WorkList from '@/components/work/WorkList';
import Awards from '@/components/sections/Awards';
import Team from '@/components/sections/Team';
import Packages from '@/components/sections/Packages';
import Reviews from '@/components/sections/Reviews';
import Faq from '@/components/sections/Faq';
import Journal from '@/components/sections/Journal';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import Reveal from '@/components/ui/Reveal';
import MagneticButton from '@/components/ui/MagneticButton';

/** Quiet and typographic: no hero image, work as an index, services as a list. */
export default function EditorialHome() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <>
      <Navbar />
      <main>
        <section id="top" className="relative flex min-h-[86svh] items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.05),transparent_65%)]" />
          <div className="relative mx-auto w-full max-w-5xl px-6 py-32 text-center sm:px-10">
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
            >
              {site.location}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 font-display text-[11vw] font-bold leading-[0.88] tracking-tighter sm:text-[8vw] lg:text-[7rem]"
            >
              {name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
            >
              {site.hero.intro}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              <MagneticButton href="#work">See the work <span aria-hidden>↘</span></MagneticButton>
              <MagneticButton href="#contact" variant="ghost">Check your date</MagneticButton>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-line">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <p className="font-display text-4xl font-bold text-accent sm:text-5xl">
                  {s.value}{s.suffix}
                </p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <WorkList />

        <section id="services" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
          <Reveal>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-accent">What we shoot</p>
          </Reveal>
          <ul className="mt-12 divide-y divide-line border-y border-line">
            {services.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.04}>
                  <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:gap-12">
                    <span className="shrink-0 font-display text-sm text-muted sm:w-14">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="shrink-0 font-display text-2xl font-semibold sm:w-72 sm:text-3xl">{s.title}</h3>
                    <p className="max-w-xl leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <Packages />
        <Team />
        <Awards />
        <Reviews />
        <Faq />
        <Journal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
