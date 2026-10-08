import Nav from './Nav';
import Hero from './Hero';
import Marquee from './Marquee';
import Work from './Work';
import Stats from './Stats';
import Services from './Services';
import Process from './Process';
import Packages from './Packages';
import Team from './Team';
import Awards from './Awards';
import Reviews from './Reviews';
import Faq from './Faq';
import Journal from './Journal';
import Contact from './Contact';
import Footer from './Footer';

/**
 * Home 1 — Collage.
 * Contact-sheet hero, a pinned horizontal work rail, cards and counters.
 * The loudest of the four.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Stats />
        <Services />
        <Process />
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
