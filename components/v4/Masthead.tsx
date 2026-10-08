'use client';
import { site, projects, stats } from '@/content/site';
import { usePreview } from '@/lib/preview';

/**
 * No hero image: version 4 states what the archive holds and then gets out
 * of the way, because the frames start one scroll below.
 */
export default function Masthead() {
  const frames = projects.reduce((n, p) => n + (p.cover ? 1 : 0) + (p.gallery?.length ?? 0), 0);
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <header id="top" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-accent">
        {site.hero.badge}
      </p>
      <h1 className="mt-7 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
        {name} — <span className="text-outline">the archive</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{site.description}</p>

      <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          ...stats.map((s) => ({
            k: s.label,
            v: s.decimals ? s.value.toFixed(s.decimals) : s.value.toLocaleString('en-IN'),
            suffix: s.suffix,
          })),
          { k: 'Shoots in the archive', v: String(projects.length), suffix: '' },
          { k: 'Frames online', v: String(frames), suffix: '' },
        ].map((d) => (
          <div key={d.k} className="bg-ink p-4">
            <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">{d.k}</dt>
            <dd className="mt-2 font-display text-2xl font-bold">
              {d.v}
              <span className="text-accent">{d.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
