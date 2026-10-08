import Rail from './Rail';
import Masthead from './Masthead';
import Work from './Work';
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
 * Home 4 — Archive.
 * A pinned index rail, then the frames: no hero, no cards, everything set
 * in the same hairline grid. The numbers live in the masthead, so there is
 * no separate stats band.
 */
export default function Home() {
  return (
    <div className="lg:flex">
      <Rail />
      <div className="min-w-0 flex-1">
        <main>
          <Masthead />
          <Work />
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
      </div>
    </div>
  );
}
