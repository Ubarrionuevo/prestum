import type { Product } from "@/config/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFlotante, type ContextoWa } from "@/components/WhatsAppFlotante";
import { site } from "@/config/site";
import { SeoLinks } from "@/components/SeoLinks";
import { ciudades, glosario } from "@/config/seo-content";

/** Marco de cada producto: su header, su contenido, su footer y el botón flotante de WhatsApp. */
export function ProductShell({ product, children }: { product: Product; children: React.ReactNode }) {
  // Solo nombres cortos (no textos completos), para que el botón pese poco en el navegador.
  const contexto: ContextoWa = {
    marca: product.brandName,
    numero: site.whatsappVentas,
    producto: product.slug,
    rubros: Object.fromEntries(product.niches.map((n) => [n.slug, n.name.toLowerCase()])),
    ciudades: Object.fromEntries(ciudades.map((c) => [c.slug, c.corto])),
    terminos: Object.fromEntries(
      glosario.map((t) => {
        const n = t.termino.replace(/\s*\(.*\)$/, "");
        return [t.slug, /[A-Z]/.test(n.slice(1)) ? n : n.toLowerCase()];
      }),
    ),
  };
  return (
    <>
      <Header product={product} />
      <main className="flex-1">{children}</main>
      <SeoLinks product={product} />
      <Footer product={product} />
      <WhatsAppFlotante contexto={contexto} />
    </>
  );
}
