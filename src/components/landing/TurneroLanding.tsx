import type { Niche, Product } from "@/config/types";
import { nichePath } from "@/config/products";
import { getPrecios } from "@/lib/planes";
import { LandingState } from "./LandingState";
import { Hero } from "./Hero";
import { Sabado } from "./Sabado";
import { Pagina } from "./Pagina";
import { Demo } from "./Demo";
import { Funciones } from "./Funciones";
import { Calculadora } from "./Calculadora";
import { Resenas } from "./Resenas";
import { Precios } from "./Precios";
import { Faq } from "./Faq";
import { Activar, MobileCta } from "./Activar";

/**
 * Landing del turnero (estructura en 10 secciones numeradas).
 * Se usa en la home (sin `niche`, con selector de rubro) y en cada /turnero/<rubro>
 * (con `niche`: textos, servicios, mensajes y FAQs del rubro → contenido único para SEO).
 *
 *  01 Hero interactivo   02 Un sábado (antes/después)   03 Armá tu página
 *  04 Demo en vivo       05 Funciones (bento)            06 Calculadora
 *  07 Reseñas/garantías  08 Precios                      09 FAQ
 *  10 Último paso (CTA)  + barra CTA fija en celular
 */
export async function TurneroLanding({ product, niche }: { product: Product; niche?: Niche }) {
  const { planes } = await getPrecios();
  const base = [...planes].sort((a, b) => a.precio_mensual - b.precio_mensual)[0];
  const faqs = niche ? [...niche.faqs, ...product.faqs] : product.faqs;
  const rubros = product.niches.map((n) => ({ href: nichePath(product, n), label: `${n.emoji} ${n.name}` }));

  return (
    <LandingState initialRubro={niche?.slug}>
      <Hero h1={niche ? niche.seoTitle : product.seoTitle} subtitle={niche ? niche.heroSubtitle : product.heroSubtitle} showRubros={!niche} />
      <Sabado n={2} />
      <Pagina n={3} />
      <Demo n={4} />
      <Funciones n={5} rubros={rubros} extra={niche ? { title: `Pensado para ${niche.name.toLowerCase()}`, items: niche.benefits } : undefined} />
      <Calculadora n={6} planBase={base.precio_mensual} planBaseNombre={base.nombre} />
      <Resenas n={7} />
      <Precios n={8} />
      <Faq n={9} faqs={faqs} />
      <Activar n={10} />
      <MobileCta />
    </LandingState>
  );
}
