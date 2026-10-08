'use client';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/content/site';
import Reveal from '@/components/ui/Reveal';
import { usePreview } from '@/lib/preview';
import { emailjsConfigured, sendByEmailJs, type Enquiry } from '@/lib/sendEnquiry';

const { types, budgets, cities } = site.contact;

const STEPS = ['What & where', 'When & budget', 'Your details'] as const;

export default function Contact() {
  const { brand } = usePreview();
  const brandName = brand.name || site.name;
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [shoot, setShoot] = useState(types[0]);
  const [city, setCity] = useState(cities[0]);
  const [budget, setBudget] = useState(budgets[budgets.length - 1]);
  const [form, setForm] = useState({ date: '', name: '', phone: '', message: '' });

  const prettyDate = form.date
    ? new Date(form.date + 'T00:00:00').toLocaleDateString('en-IN', { dateStyle: 'full' })
    : 'date not fixed yet';

  const enquiry: Enquiry = useMemo(
    () => ({
      name: form.name,
      phone: form.phone,
      shoot,
      city,
      date: prettyDate,
      budget,
      message: form.message,
    }),
    [form.name, form.phone, form.message, shoot, city, budget, prettyDate]
  );

  const text =
    `Hi ${brandName}! I'm ${form.name}.\n` +
    `Shoot: ${shoot}\n` +
    `Date: ${prettyDate}\n` +
    `Where: ${city}\n` +
    `Budget: ${budget}\n` +
    `Phone: ${form.phone}\n\n` +
    `${form.message}`;

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `${shoot} enquiry — ${prettyDate}`
  )}&body=${encodeURIComponent(text)}`;

  const detailsValid = form.name.trim().length > 1 && form.phone.trim().length >= 6;
  const canAdvance = step < 2 || detailsValid;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsValid) return;
    setSending(true);
    // Optional copy by email; the WhatsApp hand-off happens either way.
    await sendByEmailJs(enquiry);
    setSending(false);
    setSent(true);
    window.open(waHref, '_blank', 'noopener');
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      active ? 'border-accent bg-accent text-ink' : 'border-line text-muted hover:border-white/30 hover:text-white'
    }`;
  const input =
    'w-full border-b border-line bg-transparent py-3.5 text-lg outline-none transition placeholder:text-white/25 focus:border-accent';

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.25em] text-accent">Book a date</p>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Is your date <br />
            <span className="text-outline">still</span> <span className="text-accent">free?</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-muted">{site.contact.note}</p>
          <div className="mt-10 space-y-3 text-lg">
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="block hover:text-accent">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="block hover:text-accent">{site.email}</a>
            <p className="text-muted">{site.location}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
            {/* progress */}
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-sm text-muted">
                Step {Math.min(step + 1, 3)} of 3 · <span className="text-white">{STEPS[step]}</span>
              </p>
              {step > 0 && !sent && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="text-sm text-muted hover:text-white">
                  ← Back
                </button>
              )}
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              {STEPS.map((s, i) => (
                <span key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-white/10'}`} />
              ))}
            </div>

            {/* steps — fixed min height so the card does not jump */}
            <div className="relative mt-8 min-h-[22rem]">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    className="flex h-full flex-col justify-center text-center"
                  >
                    <p className="font-display text-5xl">✓</p>
                    <h3 className="mt-5 font-display text-2xl font-semibold">Enquiry ready to send</h3>
                    <p className="mt-3 text-muted">
                      WhatsApp should have opened with your details filled in. If it did not, use a button below.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <a href={waHref} target="_blank" rel="noreferrer noopener"
                        className="rounded-full bg-accent px-6 py-3.5 font-display font-semibold text-ink">
                        Open WhatsApp
                      </a>
                      <a href={mailto} className="rounded-full border border-line px-6 py-3.5 font-display font-semibold transition hover:border-white/40">
                        Send by email
                      </a>
                    </div>
                    <button type="button" onClick={() => { setSent(false); setStep(0); }} className="mt-6 text-sm text-muted hover:text-white">
                      Start another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 0 && (
                      <>
                        <p className="mb-3 text-sm text-muted">What are we shooting?</p>
                        <div className="flex flex-wrap gap-2">
                          {types.map((t) => (
                            <button type="button" key={t} onClick={() => setShoot(t)} className={chip(shoot === t)}>{t}</button>
                          ))}
                        </div>
                        <p className="mb-3 mt-8 text-sm text-muted">Where?</p>
                        <div className="flex flex-wrap gap-2">
                          {cities.map((c) => (
                            <button type="button" key={c} onClick={() => setCity(c)} className={chip(city === c)}>{c}</button>
                          ))}
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <label className="block">
                          <span className="text-sm text-muted">Shoot date</span>
                          <input
                            type="date" className={`${input} [color-scheme:dark]`}
                            value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                          />
                        </label>
                        <p className="mt-2 text-xs text-muted">Not fixed yet? Leave it blank.</p>
                        <p className="mb-3 mt-8 text-sm text-muted">Budget</p>
                        <div className="flex flex-wrap gap-2">
                          {budgets.map((b) => (
                            <button type="button" key={b} onClick={() => setBudget(b)} className={chip(budget === b)}>{b}</button>
                          ))}
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <div className="space-y-3">
                        <input
                          required placeholder="Your name" className={input} autoComplete="name"
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <input
                          required type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone / WhatsApp" className={input}
                          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        <textarea
                          rows={3} placeholder="Venue, number of functions, anything we should know"
                          className={`${input} resize-none`}
                          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        />
                        <div className="rounded-2xl border border-line bg-ink/60 p-4 text-sm text-muted">
                          <span className="text-white">{shoot}</span> · {city} · {prettyDate} · {budget}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!sent && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {step < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-full bg-accent px-7 py-3.5 font-display font-semibold text-ink"
                  >
                    Continue
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: canAdvance ? 1.03 : 1 }} whileTap={{ scale: canAdvance ? 0.97 : 1 }}
                      type="submit" disabled={!canAdvance || sending}
                      className="rounded-full bg-accent px-7 py-3.5 font-display font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {sending ? 'Sending…' : 'Check this date'}
                    </motion.button>
                    <a href={mailto} className="rounded-full border border-line px-7 py-3.5 font-display font-semibold transition hover:border-white/40">
                      Email instead
                    </a>
                  </>
                )}
              </div>
            )}

            <p className="mt-5 text-xs text-muted">
              We hold one date at a time, free, for seven days. No advance until you have a quote.
              {emailjsConfigured() ? '' : ' Your enquiry opens in WhatsApp — nothing is stored on this site.'}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
