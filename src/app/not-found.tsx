import Link from "next/link";
import { getDefaultProduct } from "@/config/products";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  const product = getDefaultProduct();
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center px-4 py-24 text-center">
      <Logo brandName={product.brandName} />
      <h1 className="mt-10 text-3xl font-bold text-slate-900">Página no encontrada</h1>
      <p className="mt-3 text-slate-600">La página que buscás no existe o se movió.</p>
      <Link href="/" className="mt-8 inline-block rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">
        Volver al inicio
      </Link>
    </main>
  );
}
