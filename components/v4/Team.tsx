import SafeImage from '@/components/ui/SafeImage';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { site, team } from '@/content/site';

/** Small square thumbs in a tight grid — a contact sheet of the studio. */
export default function Team() {
  return (
    <section id="team" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">The studio</h2>
        <p className="text-xs text-muted">Shooting together since {site.founded}</p>
      </div>

      <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {team.map((m) => (
          <li key={m.name} className="group bg-ink">
            <div className="relative aspect-square overflow-hidden">
              {m.portrait ? (
                <SafeImage
                  src={m.portrait.src}
                  alt={m.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 32vw, 50vw"
                  placeholder={m.portrait.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={m.portrait.blurDataURL}
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  placeholderLabel={m.name}
                  placeholderMarkClassName="h-7 w-7"
                />
              ) : (
                <MediaPlaceholder label={m.name} markClassName="h-7 w-7" />
              )}
            </div>
            <div className="p-3">
              <h3 className="font-display text-sm font-semibold leading-tight">{m.name}</h3>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-accent">{m.role}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{m.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
