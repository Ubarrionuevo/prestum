import Link from "next/link";
import type { Product } from "@/config/types";
import { site } from "@/config/site";
import { nichePath, productHomePath } from "@/config/products";
import { Logo } from "./Logo";

/**
 * Footer propio de cada producto, en columnas. Enlaza todas las landings de rubro
 * de ESE producto (clave para SEO), sin mostrar otros productos.
 */
export function Footer({ product }: { product: Product }) {
  const home = productHomePath(product);
  const a = (id: string) => (home === "/" ? `/#${id}` : `${home}#${id}`);
  const col = "text-xs font-bold tracking-widest text-slate-400";
  const link = "text-slate-600 hover:text-brand-700";

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pb-20 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_2fr_1fr]">
        <div>
          <Logo brandName={product.brandName} href={home} />
          <p className="mt-3 max-w-xs text-sm text-slate-600">{product.seoDescription}</p>
        </div>
        <nav aria-label="Producto">
          <p className={col}>PRODUCTO</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li><Link href={a("pagina")} className={link}>Tu página</Link></li>
            <li><Link href={a("demo")} className={link}>Demo en vivo</Link></li>
            <li><Link href={a("funciones")} className={link}>Funcionalidades</Link></li>
            <li><Link href={a("precios")} className={link}>Precios</Link></li>
            <li><Link href={a("preguntas")} className={link}>Preguntas frecuentes</Link></li>
            <li><Link href="/registro" className={link}>Empezar gratis</Link></li>
            <li><Link href="/ingresar" className={link}>Ingresar</Link></li>
          </ul>
        </nav>
        <nav aria-label={`${product.name} por rubro`}>
          <p className={col}>RUBROS</p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {product.niches.map((n) => (
              <li key={n.slug}>
                <Link href={nichePath(product, n)} className={link}>
                  {product.name} para {n.name.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Recursos y contacto">
          <p className={col}>RECURSOS</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li><Link href="/precios" className={link}>Precios</Link></li>
            <li><Link href="/glosario" className={link}>Glosario</Link></li>
            <li><Link href="/comparar" className={link}>Comparar apps de turnos</Link></li>
            <li><Link href="/turnos-online" className={link}>Turnos online por ciudad</Link></li>
            <li><Link href="/legal/terminos" className={link}>Términos</Link></li>
            <li><Link href="/legal/privacidad" className={link}>Privacidad</Link></li>
          </ul>
          <p className={`${col} mt-6`}>CONTACTO</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <a href={`https://wa.me/${site.whatsappVentas}`} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
            <li><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {product.brandName} · Hecho en Argentina
      </div>
    </footer>
  );
}
