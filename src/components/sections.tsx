import Link from "next/link";
import type { Benefit, Faq } from "@/config/types";
import { site } from "@/config/site";

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Ruta de navegación" className="mx-auto max-w-6xl px-4 pt-6 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>›</span>}
            {i < items.length - 1 ? (
              <Link href={it.path} className="hover:text-brand-700">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-700">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pt-16">
      {eyebrow && (
        <p className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-600">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={primary.href} className="rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-900">
          {primary.label}
        </Link>
        {secondary && (
          <a
            href={secondary.href}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:border-brand-700 hover:text-brand-700"
          >
            {secondary.label}
          </a>
        )}
      </div>
    </section>
  );
}

export function Benefits({ title, items }: { title: string; items: Benefit[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <div key={b.title} className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">{b.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { t: "Compartís tu link", d: "En Instagram, Google Maps, WhatsApp o donde quieras." },
    { t: "El cliente elige", d: "Servicio, día, horario y cómo va a pagar." },
    { t: "Te llega a WhatsApp", d: "Con todos los datos del turno, listo para confirmar." },
  ];
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-brand-50/60">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cómo funciona</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Preguntas frecuentes</h2>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none font-medium text-slate-900 marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span className="text-brand-700 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ContactCta({ text, demoPath }: { text: string; demoPath?: string }) {
  const msg = encodeURIComponent(text);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-3xl bg-brand-900 px-6 py-12 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold sm:text-3xl">¿Lo querés para tu negocio?</h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          Te lo dejamos configurado con tus servicios, precios y horarios.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${site.whatsappVentas}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50"
          >
            Hablar por WhatsApp
          </a>
          {demoPath && (
            <Link href={demoPath} className="rounded-xl border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">
              Probar la demo
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
