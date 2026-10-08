'use client';
import { site } from '@/content/site';
import HeroVideo from '@/components/backdrop/HeroVideo';
import { emailjsConfigured } from '@/lib/sendEnquiry';
import { useEnquiry } from '@/lib/useEnquiry';

/**
 * Version 3 books over the footage: one centred panel on a full-screen
 * frame, everything on a single screen so nothing scrolls mid-enquiry.
 */
export default function Contact() {
  const e = useEnquiry();

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs transition ${
      active ? 'border-accent bg-accent text-ink' : 'border-white/20 text-white/70 hover:border-white/50'
    }`;
  const input =
    'w-full border-b border-white/20 bg-transparent py-3 outline-none transition placeholder:text-white/30 focus:border-accent';

  return (
    <section id="contact" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <HeroVideo />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 py-24 sm:px-10">
        <div className="rounded-[2rem] border border-white/15 bg-ink/70 p-7 backdrop-blur-xl sm:p-10">
          {e.sent ? (
            <div className="text-center">
              <p className="font-display text-5xl text-accent">✓</p>
              <h2 className="mt-6 font-display text-3xl font-semibold">Enquiry ready to send</h2>
              <p className="mt-4 text-muted">
                WhatsApp should have opened with your details. If it did not, use one of these.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={e.waHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full bg-accent px-6 py-3.5 font-display font-semibold text-ink"
                >
                  Open WhatsApp
                </a>
                <a href={e.mailto} className="rounded-full border border-white/25 px-6 py-3.5 font-display font-semibold">
                  Send by email
                </a>
              </div>
              <button type="button" onClick={e.restart} className="mt-7 text-sm text-muted hover:text-white">
                Start another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={e.submit}>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Book a date</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">
                Is your date still free?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{site.contact.note}</p>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="mb-2.5 text-xs uppercase tracking-[0.22em] text-muted">Shoot</p>
                  <div className="flex flex-wrap gap-2">
                    {e.types.map((t) => (
                      <button type="button" key={t} onClick={() => e.setShoot(t)} className={chip(e.shoot === t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2.5 text-xs uppercase tracking-[0.22em] text-muted">Where</p>
                    <div className="flex flex-wrap gap-2">
                      {e.cities.map((c) => (
                        <button type="button" key={c} onClick={() => e.setCity(c)} className={chip(e.city === c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2.5 text-xs uppercase tracking-[0.22em] text-muted">Budget</p>
                    <div className="flex flex-wrap gap-2">
                      {e.budgets.map((b) => (
                        <button type="button" key={b} onClick={() => e.setBudget(b)} className={chip(e.budget === b)}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">Date</span>
                    <input
                      type="date"
                      className={`${input} [color-scheme:dark]`}
                      value={e.form.date}
                      onChange={(ev) => e.setForm({ ...e.form, date: ev.target.value })}
                    />
                  </label>
                  <input
                    required placeholder="Your name" autoComplete="name" className={`${input} sm:self-end`}
                    value={e.form.name} onChange={(ev) => e.setForm({ ...e.form, name: ev.target.value })}
                  />
                  <input
                    required type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone / WhatsApp" className={input}
                    value={e.form.phone} onChange={(ev) => e.setForm({ ...e.form, phone: ev.target.value })}
                  />
                  <input
                    placeholder="Venue or anything we should know" className={input}
                    value={e.form.message} onChange={(ev) => e.setForm({ ...e.form, message: ev.target.value })}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={!e.valid || e.sending}
                  className="rounded-full bg-accent px-7 py-3.5 font-display font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {e.sending ? 'Sending…' : 'Check this date'}
                </button>
                <a href={e.mailto} className="rounded-full border border-white/25 px-7 py-3.5 font-display text-sm font-semibold">
                  Email instead
                </a>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted">
                {e.shoot} · {e.city} · {e.prettyDate} · {e.budget}
                {emailjsConfigured() ? '' : ' — your enquiry opens in WhatsApp, nothing is stored on this site.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
