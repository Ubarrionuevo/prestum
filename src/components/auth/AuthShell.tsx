import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getDefaultProduct } from "@/config/products";

/** Marco mínimo para registro / ingreso: logo + tarjeta centrada. Nada que distraiga. */
export function AuthShell({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  const product = getDefaultProduct();
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-brand-50 to-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Logo brandName={product.brandName} />
        <Link href="/" className="text-sm text-slate-500 hover:text-brand-700">
          ← Volver
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-10 px-4 pb-16 pt-4 lg:grid-cols-[1fr_380px] lg:pt-10">
        <div className="mx-auto w-full max-w-md">{children}</div>
        {aside && <aside className="hidden lg:block">{aside}</aside>}
      </main>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10";
export const labelCls = "grid gap-1.5 text-sm font-medium text-slate-700";
export const btnCls =
  "w-full rounded-xl bg-brand-700 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60";
