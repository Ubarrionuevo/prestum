"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { errorAmigable, getSupabase, supabaseConfigured } from "@/lib/supabase";
import { btnCls, inputCls, labelCls } from "./AuthShell";

export function IngresarForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "error" | "ok"; texto: string } | null>(null);

  // Si ya hay sesión, directo al panel.
  useEffect(() => {
    if (!supabaseConfigured) return;
    getSupabase()
      .auth.getSession()
      .then(({ data }) => data.session && router.replace("/panel"));
  }, [router]);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) return setMsg({ tipo: "error", texto: "Falta configurar Supabase." });
    setCargando(true);
    setMsg(null);
    const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pass });
    setCargando(false);
    if (error) return setMsg({ tipo: "error", texto: errorAmigable(error.message) });
    router.replace("/panel");
  }

  async function recuperar() {
    if (!/\S+@\S+\.\S+/.test(email)) return setMsg({ tipo: "error", texto: "Escribí tu email y tocá de nuevo “Olvidé mi contraseña”." });
    const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/panel?nueva-clave=1`,
    });
    setMsg(error ? { tipo: "error", texto: errorAmigable(error.message) } : { tipo: "ok", texto: "Te mandamos un email para crear una contraseña nueva." });
  }

  return (
    <form onSubmit={ingresar} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Ingresar</h1>
      <p className="mt-1 text-slate-600">Entrá a tu panel para ver tus turnos.</p>
      <div className="mt-6 grid gap-4">
        <label className={labelCls}>
          Email
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className={labelCls}>
          Contraseña
          <input className={inputCls} type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" required />
        </label>
      </div>
      {msg && <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${msg.tipo === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{msg.texto}</p>}
      <button className={`${btnCls} mt-6`} disabled={cargando}>
        {cargando ? "Entrando…" : "Ingresar"}
      </button>
      <button type="button" onClick={recuperar} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-brand-700">
        Olvidé mi contraseña
      </button>
      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-semibold text-brand-700 hover:underline">
          Empezá gratis
        </Link>
      </p>
    </form>
  );
}
