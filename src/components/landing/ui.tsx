import { formatPrecio } from "@/config/negocios";

/** Encabezado numerado de cada sección: "02 · UN SÁBADO EN TU NEGOCIO" + título. */
export function SectionHead({
  n,
  eyebrow,
  title,
  subtitle,
  center = false,
  dark = false,
}: {
  n: number;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`flex items-center gap-3 text-xs font-bold tracking-[0.18em] ${center ? "justify-center" : ""} ${dark ? "text-brand-100" : "text-brand-700"}`}>
        <span className={`rounded-md px-1.5 py-0.5 ${dark ? "bg-white/10" : "bg-brand-50"}`}>{String(n).padStart(2, "0")}</span>
        {eyebrow.toUpperCase()}
      </p>
      <h2 className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${dark ? "text-white" : "text-slate-900"}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-lg ${dark ? "text-brand-100" : "text-slate-600"}`}>{subtitle}</p>}
    </div>
  );
}

export function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 py-14 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );
}

/** Marco de celular para las vistas previas. */
export function Phone({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      {label && <p className="mb-2 text-center text-[11px] font-bold tracking-widest text-slate-400">{label}</p>}
      <div className="rounded-[2.2rem] border-[10px] border-slate-900 bg-white shadow-2xl shadow-brand-900/20">
        <div className="mx-auto mt-1.5 h-1.5 w-16 rounded-full bg-slate-200" />
        <div className="max-h-[560px] overflow-hidden rounded-b-[1.6rem]">{children}</div>
      </div>
    </div>
  );
}

/** Vista previa de la página de reservas (lo que ve el cliente). */
export function BookingPreview({
  nombre,
  servicios,
  horarios = ["10:00", "10:30", "11:00", "11:30", "12:00", "15:00", "15:30", "16:00"],
}: {
  nombre: string;
  servicios: Array<{ nombre: string; duracion: number; precio: number; top?: boolean }>;
  horarios?: string[];
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-lg font-bold text-white">
          {nombre.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{nombre}</p>
          <p className="text-xs text-emerald-600">● Abierto hoy · 9 a 19 h</p>
        </div>
      </div>
      <p className="mt-4 text-[10px] font-bold tracking-widest text-slate-400">ELEGÍ EL SERVICIO</p>
      <ul className="mt-2 grid gap-2">
        {servicios.map((s, i) => (
          <li
            key={s.nombre}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${i === 0 ? "border-brand-600 bg-brand-50" : "border-slate-200"}`}
          >
            <span>
              <span className="font-semibold text-slate-900">{s.nombre}</span>
              {s.top && <span className="ml-1 text-[10px] font-semibold text-amber-600">★ Más pedido</span>}
              <span className="block text-xs text-slate-500">{s.duracion} min</span>
            </span>
            <span className="font-bold text-brand-700">{formatPrecio(s.precio)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[10px] font-bold tracking-widest text-slate-400">HORARIOS DE HOY</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {horarios.map((h, i) => (
          <span
            key={h}
            className={`rounded-lg border py-1.5 text-center text-xs font-medium ${i === 2 ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 text-slate-700"}`}
          >
            {h}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[#25D366] py-3 text-center text-sm font-bold text-white">Reservar por WhatsApp</div>
    </div>
  );
}

export function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
    </svg>
  );
}

export function Check({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs ${dark ? "bg-white/15 text-white" : "bg-brand-100 text-brand-700"}`}>✓</span>
      <span>{children}</span>
    </li>
  );
}
