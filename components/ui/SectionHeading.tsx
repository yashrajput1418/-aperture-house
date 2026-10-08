import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, align = 'left' }: { eyebrow: string; title: React.ReactNode; align?: 'left' | 'center' }) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{title}</h2>
    </Reveal>
  );
}
