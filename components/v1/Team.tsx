import SafeImage from '@/components/ui/SafeImage';
import { site, team } from '@/content/site';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

export default function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow="The studio"
          title={<>The people <span className="text-outline">behind</span> the camera</>}
        />
        <Reveal delay={0.1}>
          <p className="max-w-xs text-muted">
            Shooting together since {site.founded}. {site.location}. The people you meet at the
            studio are the people who turn up on the day.
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
        {team.map((m, i) => (
          <li key={m.name}>
            <Reveal delay={i * 0.05}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-ink-2">
                {m.portrait ? (
                  <SafeImage
                    src={m.portrait.src}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                    placeholder={m.portrait.blurDataURL ? 'blur' : 'empty'}
                    blurDataURL={m.portrait.blurDataURL}
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    placeholderLabel={m.name}
                    placeholderMarkClassName="h-8 w-8"
                  />
                ) : (
                  <MediaPlaceholder label={m.name} markClassName="h-8 w-8" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="absolute inset-x-3 bottom-3 translate-y-2 text-xs leading-snug text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/80">
                  {m.bio}
                </p>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-tight">{m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.role}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
