import Nav from './Nav';
import Hero from './Hero';
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
 * Home 3 — Cinematic.
 * Showreel hero, one full-height panel per shoot, horizontal strips for
 * services and the team, and a booking panel set over footage. The nav
 * floats on the film rather than sitting in a bar.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
