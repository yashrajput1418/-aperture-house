'use client';
import { site, stats } from '@/content/site';
import { usePreview } from '@/lib/preview';
import Logo from '@/components/ui/Logo';
import WorkArchive from '@/components/work/WorkArchive';
import Services from '@/components/sections/Services';
import Packages from '@/components/sections/Packages';
import Team from '@/components/sections/Team';
import Awards from '@/components/sections/Awards';
import Reviews from '@/components/sections/Reviews';
import Faq from '@/components/sections/Faq';
import Journal from '@/components/sections/Journal';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

/** No hero. Opens straight into the archive, with a sticky rail on the left. */
export default function GridHome() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <>
      <div className="lg:flex">
        {/* sticky rail */}
        <aside className="z-30 border-b border-line bg-ink/90 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-6 px-6 py-5 lg:h-full lg:flex-col lg:items-start lg:justify-start lg:px-8 lg:py-10">
            <a href="#top"><Logo /></a>

            <nav className="hidden lg:mt-16 lg:flex lg:flex-col lg:gap-4">
              {site.nav.map((n) => (
                <a key={n.href} href={n.href} className="group font-display text-2xl text-muted transition-colors hover:text-white">
                  {n.label}
                  <span className="ml-2 inline-block text-accent opacity-0 transition-opacity group-hover:opacity-100">·</span>
                </a>
              ))}
            </nav>

            <div className="hidden lg:mt-auto lg:block">
              <p className="text-sm leading-relaxed text-muted">{site.location}</p>
              <a href={`mailto:${site.email}`} className="mt-3 block text-sm hover:text-accent">{site.email}</a>
              <a
                href="#contact"
                className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-ink"
              >
                Check your date
              </a>
            </div>

            <nav className="flex gap-5 lg:hidden">
              {site.nav.slice(0, 3).map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-muted hover:text-white">{n.label}</a>
              ))}
            </nav>
          </div>
        </aside>

        <main id="top" className="min-w-0 flex-1">
          <header className="border-b border-line px-6 py-14 sm:px-10">
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
              {name} — <span className="text-outline">the archive</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
            <ul className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              {stats.map((s) => (
                <li key={s.label}>
                  <span className="font-display text-2xl font-bold text-accent">{s.value}{s.suffix}</span>
                  <span className="ml-2 text-sm text-muted">{s.label}</span>
                </li>
              ))}
            </ul>
          </header>

          <WorkArchive />
          <Services />
          <Packages />
          <Team />
          <Awards />
          <Reviews />
          <Faq />
          <Journal />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}
