import { clients } from '@/content/site';

/**
 * Version 2 lists the venues instead of scrolling them: a set wordmark
 * column, the way a press page prints its stockists.
 */
export default function Clients() {
  return (
    <section aria-label="Venues and brands" className="border-b border-line">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[18rem_1fr]">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">
          Venues &amp; brands
          <span className="mt-2 block text-white/40">{clients.length} regulars</span>
        </p>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c) => (
            <li
              key={c}
              className="font-display text-lg text-white/45 transition-colors hover:text-white sm:text-xl"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
