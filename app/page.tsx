import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Work from '@/components/sections/Work';
import Stats from '@/components/sections/Stats';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import Packages from '@/components/sections/Packages';
import Team from '@/components/sections/Team';
import Reviews from '@/components/sections/Reviews';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Stats />
        <Services />
        <Process />
        <Packages />
        <Team />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
