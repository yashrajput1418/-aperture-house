import SafeImage from '@/components/ui/SafeImage';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { site, team } from '@/content/site';
import Reveal from '@/components/ui/Reveal';

/** The studio as a credits list: name, role, and a small portrait beside it. */
export default function Team() {
  return (
    <section id="team" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">The studio</h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Shooting together since {site.founded}. The people you meet at the studio are the people
            who turn up on the day.
          </p>
        </div>

        <ul className="divide-y divide-line">
          {team.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 0.04}>
                <div className="grid items-center gap-5 py-6 sm:grid-cols-[4.5rem_1fr_1fr] sm:gap-10">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-line bg-ink-2 sm:h-24 sm:w-[4.5rem]">
                    {m.portrait ? (
                      <SafeImage
                        src={m.portrait.src}
                        alt={m.name}
                        fill
                        sizes="72px"
                        placeholder={m.portrait.blurDataURL ? 'blur' : 'empty'}
                        blurDataURL={m.portrait.blurDataURL}
                        className="object-cover grayscale"
                        placeholderLabel={m.name}
                        placeholderMarkClassName="h-6 w-6"
                      />
                    ) : (
                      <MediaPlaceholder label={m.name} markClassName="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{m.name}</h3>
                    <p className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                      {m.role}
                    </p>
                  </div>
                  <p className="max-w-md leading-relaxed text-muted">{m.bio}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
