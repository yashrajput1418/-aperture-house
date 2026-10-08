import Nav from './Nav';
import Hero from './Hero';
import Clients from './Clients';
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
 * Home 2 — Editorial.
 * A masthead, type-only hero and ruled sections throughout: every section
 * is a list or a grid of rules rather than a card. No section carries a
 * background image, so the page reads like print.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Clients />
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
