"use client";

import { leerOrigen } from "@/lib/origen";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { demos, getDemo } from "@/config/products/turnero-landing";
import { turnero } from "@/config/products/turnero";
import { RUBRO_ALIASES, RUBROS_FOCO } from "@/config/aliases";
import { RESERVED_SLUGS, SLUG_RE } from "@/config/reserved";
import { slugify } from "@/components/landing/LandingState";
import { errorAmigable, getSupabase, supabaseConfigured } from "@/lib/supabase";
import { normalizarWhatsApp } from "@/lib/telefono";
import { btnCls, inputCls, labelCls } from "./AuthShell";
import { TURNOS_GRATIS } from "@/config/planes";

const HORARIOS_DEFAULT = {
  "1": [["09:00", "13:00"], ["15:00", "19:00"]],
  "2": [["09:00", "13:00"], ["15:00", "19:00"]],
  "3": [["09:00", "13:00"], ["15:00", "19:00"]],
  "4": [["09:00", "13:00"], ["15:00", "19:00"]],
  "5": [["09:00", "13:00"], ["15:00", "19:00"]],
  "6": [["09:00", "13:00"]],
};

/**
 * Registro en UN paso: nombre del negocio, email, WhatsApp y contraseña.
 * Al crear la cuenta, la base genera el negocio con servicios y horarios de ejemplo
 * del rubro → el link queda andando al instante y se ajusta después desde el panel.
 */
export function RegistroForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [nombre, setNombre] = useState(params.get("nombre") ?? "");
  const [rubro, setRubro] = useState(() => {
    const p = params.get("rubro") ?? "";
    const r = RUBRO_ALIASES[p] ?? p; // ej: "manicuria" → "esteticistas"
    return demos[r] && turnero.niches.some((n) => n.slug === r) ? r : "barberias";
  });
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [pass, setPass] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [estado, setEstado] = useState<"idle" | "enviando" | "revisar-email">("idle");
  const [error, setError] = useState<string | null>(null);
  const [libre, setLibre] = useState<boolean | null>(null);

  const slug = useMemo(() => slugify(nombre).slice(0, 36).replace(/-$/, ""), [nombre]);
  const waNorm = normalizarWhatsApp(wa);

  // Chequea si el link está libre (con pausa para no consultar en cada tecla).
  useEffect(() => {
    setLibre(null);
    if (!supabaseConfigured || !SLUG_RE.test(slug) || RESERVED_SLUGS.has(slug)) return;
    const t = setTimeout(async () => {
      const { data } = await getSupabase().rpc("slug_disponible", { p_slug: slug });
      setLibre(Boolean(data));
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);

  const valido = nombre.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && waNorm && pass.length >= 6;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || estado === "enviando") return;
    if (!supabaseConfigured) {
      setError("El registro todavía no está conectado (falta configurar Supabase).");
      return;
    }
    setEstado("enviando");
    setError(null);
    const demo = getDemo(rubro);
    const servicios = demo.servicios.map((s) => ({ id: slugify(s.nombre), nombre: s.nombre, precio: s.precio, duracion: s.duracion }));
    const { data, error } = await getSupabase().auth.signUp({
      email: email.trim().toLowerCase(),
      password: pass,
      options: {
        data: { nombre: nombre.trim(), whatsapp: waNorm, rubro, servicios, horarios: HORARIOS_DEFAULT, origen: leerOrigen() },
        emailRedirectTo: `${window.location.origin}/panel?bienvenida=1`,
      },
    });
    if (error) {
      setEstado("idle");
      setError(errorAmigable(error.message));
      return;
    }
    if (data.session) router.replace("/panel?bienvenida=1");
    else setEstado("revisar-email");
  }

  // Link de invitación de un equipo: solo email + contraseña.
  const invitacion = params.get("invitacion");
  if (invitacion) return <InvitacionForm emailInvitado={invitacion} />;

  if (estado === "revisar-email") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100">
        <p className="text-4xl">📬</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Revisá tu email</h1>
        <p className="mt-2 text-slate-600">
          Te mandamos un link a <strong>{email}</strong> para activar tu cuenta. Después entrás directo a tu panel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8" noValidate>
      <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">GRATIS HASTA {TURNOS_GRATIS} TURNOS POR MES · SIN TARJETA</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Creá tu agenda online</h1>
      <p className="mt-1 text-slate-600">En 1 minuto tenés tu link para compartir con tus clientes.</p>

      <div className="mt-6 grid gap-4">
        <label className={labelCls}>
          Nombre de tu negocio
          <input className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value.slice(0, 60))} placeholder="Ej: Barbería Don Ramón" autoComplete="organization" required />
          <span className="text-xs font-normal text-slate-500">
            Tu link: <span className="font-mono text-brand-700">prestum.com.ar/{slug || "tu-negocio"}</span>
            {libre === true && <span className="ml-1 text-emerald-600">✓ disponible</span>}
            {libre === false && <span className="ml-1 text-amber-600">· ocupado, le agregamos un número</span>}
          </span>
        </label>

        <label className={labelCls}>
          Rubro
          <select className={inputCls} value={rubro} onChange={(e) => setRubro(e.target.value)}>
            {turnero.niches
              .filter((n) => RUBROS_FOCO.includes(n.slug))
              .map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.emoji} {n.name}
                </option>
              ))}
            <optgroup label="Otros rubros">
              {turnero.niches
                .filter((n) => !RUBROS_FOCO.includes(n.slug))
                .map((n) => (
                  <option key={n.slug} value={n.slug}>
                    {n.emoji} {n.name}
                  </option>
                ))}
              <option value="default">Otro</option>
            </optgroup>
          </select>
        </label>

        <label className={labelCls}>
          Email
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vos@email.com" autoComplete="email" required />
        </label>

        <label className={labelCls}>
          WhatsApp (donde te llegan las reservas)
          <input className={inputCls} type="tel" inputMode="tel" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="Ej: 383 403-5119" autoComplete="tel" required />
          <span className={`text-xs font-normal ${wa && !waNorm ? "text-rose-600" : "text-slate-500"}`}>
            {wa && !waNorm ? "Poné código de área + número (sin 0 ni 15)." : "Código de área + número."}
          </span>
        </label>

        <label className={labelCls}>
          Contraseña
          <div className="relative">
            <input
              className={`${inputCls} pr-20`}
              type={verPass ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <button type="button" onClick={() => setVerPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              {verPass ? "Ocultar" : "Ver"}
            </button>
          </div>
        </label>
      </div>

      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <button type="submit" className={`${btnCls} mt-6`} disabled={!valido || estado === "enviando"}>
        {estado === "enviando" ? "Creando tu agenda…" : "Empezar gratis"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        Al registrarte aceptás los{" "}
        <Link href="/legal/terminos" className="underline">
          términos
        </Link>{" "}
        y la{" "}
        <Link href="/legal/privacidad" className="underline">
          política de privacidad
        </Link>
        .
      </p>
      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/ingresar" className="font-semibold text-brand-700 hover:underline">
          Ingresar
        </Link>
      </p>
    </form>
  );
}

/**
 * Registro de alguien invitado a un equipo (recepción o profesional).
 * No crea un negocio: la base lo suma al equipo que lo invitó (ver crear_negocio_al_registrarse).
 */
function InvitacionForm({ emailInvitado }: { emailInvitado: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(emailInvitado);
  const [pass, setPass] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) return setError("El registro todavía no está conectado (falta configurar Supabase).");
    if (pass.length < 6) return setError("La contraseña tiene que tener al menos 6 caracteres.");
    setEnviando(true);
    setError(null);
    const { data, error } = await getSupabase().auth.signUp({
      email: email.trim().toLowerCase(),
      password: pass,
      options: { data: { invitado: true }, emailRedirectTo: `${window.location.origin}/panel` },
    });
    setEnviando(false);
    if (error) {
      // Si no hay invitación para ese email, la base no puede crear una cuenta sin datos del negocio.
      if (error.message.includes("Database error")) return setError("No encontramos una invitación para ese email. Pedile al dueño que te invite con este email.");
      return setError(errorAmigable(error.message));
    }
    if (data.session) router.replace("/panel");
    else setError("Te mandamos un email para confirmar tu cuenta. Después ingresá desde /ingresar.");
  }

  return (
    <form onSubmit={enviar} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8">
      <p className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">INVITACIÓN A UN EQUIPO</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Creá tu acceso</h1>
      <p className="mt-1 text-slate-600">Usá el mismo email con el que te invitaron.</p>
      <div className="mt-6 grid gap-4">
        <label className={labelCls}>
          Email
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className={labelCls}>
          Contraseña
          <input className={inputCls} type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" minLength={6} placeholder="Mínimo 6 caracteres" required />
        </label>
      </div>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <button className={`${btnCls} mt-6`} disabled={enviando}>
        {enviando ? "Creando…" : "Entrar al equipo"}
      </button>
      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/ingresar" className="font-semibold text-brand-700 hover:underline">
          Ingresar
        </Link>
      </p>
    </form>
  );
}
