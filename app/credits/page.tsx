import Link from 'next/link';
import type { Metadata } from 'next';
import creditsJson from '@/content/credits.json';
import { projects, site } from '@/content/site';
import Footer from '@/components/v1/Footer';
import Reveal from '@/components/ui/Reveal';

type CreditItem = {
  file: string;
  type: 'image' | 'video';
  usedFor?: string;
  source: 'Unsplash' | 'Pixabay';
  author: string;
  authorUrl: string;
  sourceUrl: string;
  license: string;
  licenseUrl?: string;
};

type CreditsFile = {
  generatedAt: string | null;
  notice?: string;
  sources?: { name: string; url: string; license: string; licenseUrl: string }[];
  items: CreditItem[];
};

const credits = creditsJson as unknown as CreditsFile;

export const metadata: Metadata = {
  title: `Media credits — ${site.name}`,
  description: 'Photographers, videographers, sources and licences for every photo and video used on this site.',
  robots: { index: false },
};

/** "/media/atlas-coffee-roasters/cover.webp" → "Atlas Roasters" */
function groupLabel(file: string): string {
  const seg = file.split('/')[2] ?? 'other';
  if (seg === 'hero') return 'Hero';
  if (seg === 'team') return 'Team portraits';
  return projects.find((p) => p.slug === seg)?.title ?? seg;
}

export default function CreditsPage() {
  const groups = new Map<string, CreditItem[]>();
  for (const item of credits.items ?? []) {
    const key = groupLabel(item.file);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  const total = credits.items?.length ?? 0;

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white">← {site.name}</Link>

        <Reveal className="mt-14">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-accent">Attribution</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">Media credits</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            {credits.notice ??
              'Every photo and video on this site was downloaded through an official free-stock API and is credited below.'}
          </p>
          {credits.sources && credits.sources.length > 0 && (
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {credits.sources.map((s) => (
                <span key={s.name}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-white hover:text-accent">{s.name}</a>
                  {' — '}
                  <a href={s.licenseUrl} target="_blank" rel="noreferrer noopener" className="underline hover:text-white">{s.license}</a>
                </span>
              ))}
            </p>
          )}
          {credits.generatedAt && (
            <p className="mt-4 text-sm text-muted">
              {total} files · last fetched {new Date(credits.generatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
            </p>
          )}
        </Reveal>

        {total === 0 ? (
          <div className="mt-16 rounded-3xl border border-line bg-ink-2/60 p-8 text-muted">
            <p className="text-white">No media has been downloaded yet.</p>
            <p className="mt-3">
              Copy <code className="text-accent">.env.example</code> to <code className="text-accent">.env.local</code>,
              add a free Unsplash and Pixabay key, then run:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-ink p-4 text-sm text-white">npm run fetch:media</pre>
            <p className="mt-3">Every downloaded file will be listed on this page automatically.</p>
          </div>
        ) : (
          <div className="mt-16 space-y-14">
            {[...groups.entries()].map(([label, items]) => (
              <section key={label}>
                <h2 className="font-display text-2xl font-semibold">{label}</h2>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {items.map((it) => (
                    <li key={it.file} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm text-white/80">{it.file}</p>
                        {it.usedFor && <p className="mt-1 text-sm text-muted">{it.usedFor}</p>}
                      </div>
                      <p className="text-sm text-muted">
                        <span className="rounded-full border border-line px-2 py-0.5 text-xs uppercase tracking-wider">{it.type}</span>{' '}
                        <a href={it.authorUrl} target="_blank" rel="noreferrer noopener" className="text-white hover:text-accent">{it.author}</a>
                        {' · '}
                        <a href={it.sourceUrl} target="_blank" rel="noreferrer noopener" className="underline hover:text-white">{it.source}</a>
                        {it.licenseUrl ? (
                          <>
                            {' · '}
                            <a href={it.licenseUrl} target="_blank" rel="noreferrer noopener" className="hover:text-white">{it.license}</a>
                          </>
                        ) : (
                          <> · {it.license}</>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
