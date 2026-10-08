import SafeImage from '@/components/ui/SafeImage';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { site, team } from '@/content/site';

/** A tall, swipeable strip of portraits — credits at the end of the film. */
export default function Team() {
  return (
    <section id="team" className="border-y border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">The studio</p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
          The people behind the camera
        </h2>
        <p className="mt-5 max-w-md text-muted">
          Shooting together since {site.founded}. The people you meet are the people who turn up.
        </p>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-10 [scrollbar-width:none]">
        {team.map((m) => (
          <figure
            key={m.name}
            className="group relative h-[62svh] min-h-[380px] w-[72vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 sm:w-[20rem]"
          >
            {m.portrait ? (
              <SafeImage
                src={m.portrait.src}
                alt={m.name}
                fill
                sizes="(min-width: 640px) 320px, 72vw"
                placeholder={m.portrait.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={m.portrait.blurDataURL}
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                placeholderLabel={m.name}
                placeholderMarkClassName="h-10 w-10"
              />
            ) : (
              <MediaPlaceholder label={m.name} markClassName="h-10 w-10" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-2xl font-semibold">{m.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-accent">{m.role}</p>
              <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/70 transition-all duration-500 group-hover:max-h-24">
                {m.bio}
              </p>
            </figcaption>
          </figure>
        ))}
        <div className="w-2 shrink-0 sm:w-6" />
      </div>
    </section>
  );
}
