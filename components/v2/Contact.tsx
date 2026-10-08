'use client';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';
import { emailjsConfigured } from '@/lib/sendEnquiry';
import { useEnquiry } from '@/lib/useEnquiry';

/**
 * Version 2 asks for everything on one page — no steps, no card. It reads
 * like a printed booking form: labelled rows separated by rules.
 */
export default function Contact() {
  const e = useEnquiry();

  const row = 'grid gap-3 border-b border-line py-7 sm:grid-cols-[12rem_1fr] sm:gap-10';
  const label = 'font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:pt-3';
  const chip = (active: boolean) =>
    `border px-4 py-2 font-display text-sm transition ${
      active ? 'border-accent bg-accent text-ink' : 'border-line text-muted hover:border-white/40 hover:text-white'
    }`;
  const input =
    'w-full border-b border-line bg-transparent py-3 text-lg outline-none transition placeholder:text-white/25 focus:border-accent';

  return (
    <section id="contact" className="border-b border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 border-b border-line pb-10 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <h2 className="font-display text-5xl font-bold leading-[0.9] tracking-tight sm:text-[7rem]">
            Is your date
            <span className="block text-accent">still free?</span>
          </h2>
          <div className="self-end">
            <p className="leading-relaxed text-muted">{site.contact.note}</p>
            <div className="mt-6 space-y-1.5 font-display">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="block hover:text-accent">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="block hover:text-accent">{site.email}</a>
            </div>
          </div>
        </div>

        {e.sent ? (
          <Reveal className="py-16">
            <p className="font-display text-5xl text-accent">✓</p>
            <h3 className="mt-6 font-display text-3xl font-semibold">Enquiry ready to send</h3>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">
              WhatsApp should have opened with your details filled in. If it did not, use one of
              these instead.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={e.waHref}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-accent px-7 py-3.5 font-display font-semibold text-ink"
              >
                Open WhatsApp
              </a>
              <a href={e.mailto} className="border border-line px-7 py-3.5 font-display font-semibold hover:border-white/40">
                Send by email
              </a>
            </div>
            <button type="button" onClick={e.restart} className="mt-8 text-sm text-muted underline hover:text-white">
              Start another enquiry
            </button>
          </Reveal>
        ) : (
          <form onSubmit={e.submit} className="mt-2">
            <div className={row}>
              <p className={label}>01 — Shoot</p>
              <div className="flex flex-wrap gap-2">
                {e.types.map((t) => (
                  <button type="button" key={t} onClick={() => e.setShoot(t)} className={chip(e.shoot === t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className={row}>
              <p className={label}>02 — Where</p>
              <div className="flex flex-wrap gap-2">
                {e.cities.map((c) => (
                  <button type="button" key={c} onClick={() => e.setCity(c)} className={chip(e.city === c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className={row}>
              <p className={label}>03 — Budget</p>
              <div className="flex flex-wrap gap-2">
                {e.budgets.map((b) => (
                  <button type="button" key={b} onClick={() => e.setBudget(b)} className={chip(e.budget === b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className={row}>
              <label className={label} htmlFor="v2-date">04 — Date</label>
              <div>
                <input
                  id="v2-date"
                  type="date"
                  className={`${input} [color-scheme:dark] max-w-xs`}
                  value={e.form.date}
                  onChange={(ev) => e.setForm({ ...e.form, date: ev.target.value })}
                />
                <p className="mt-2 text-xs text-muted">Not fixed yet? Leave it blank.</p>
              </div>
            </div>

            <div className={row}>
              <label className={label} htmlFor="v2-name">05 — You</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  id="v2-name" required placeholder="Your name" autoComplete="name" className={input}
                  value={e.form.name} onChange={(ev) => e.setForm({ ...e.form, name: ev.target.value })}
                />
                <input
                  required type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone / WhatsApp" className={input}
                  value={e.form.phone} onChange={(ev) => e.setForm({ ...e.form, phone: ev.target.value })}
                />
                <textarea
                  rows={3} placeholder="Venue, number of functions, anything we should know"
                  className={`${input} resize-none sm:col-span-2`}
                  value={e.form.message} onChange={(ev) => e.setForm({ ...e.form, message: ev.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-10">
              <button
                type="submit"
                disabled={!e.valid || e.sending}
                className="bg-accent px-8 py-4 font-display font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {e.sending ? 'Sending…' : 'Check this date'}
              </button>
              <a href={e.mailto} className="font-display text-sm text-accent underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent">
                Email instead
              </a>
              <p className="text-sm text-muted">
                {e.shoot} · {e.city} · {e.prettyDate} · {e.budget}
              </p>
            </div>

            <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">
              We hold one date at a time, free, for seven days. No advance until you have a quote.
              {emailjsConfigured() ? '' : ' Your enquiry opens in WhatsApp — nothing is stored on this site.'}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
