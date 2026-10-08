import { services } from '@/content/site';
import SectionHeading from '@/components/ui/SectionHeading';
import TiltCard from '@/components/ui/TiltCard';
import Reveal from '@/components/ui/Reveal';

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
      <SectionHeading eyebrow="What we shoot" title={<>Every shoot, <span className="text-accent">covered</span></>} />
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <TiltCard className="h-full rounded-3xl border border-line bg-ink-2 p-8 transition-colors hover:border-white/20">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-accent">{s.icon}</span>
              <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
