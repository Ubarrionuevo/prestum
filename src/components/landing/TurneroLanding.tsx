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
import { Precios } from "./Precios";
import { Faq } from "./Faq";
import { PRUEBA_DIAS } from "@/config/planes";
import { ComoFunciona } from "./ComoFunciona";
import { Activar, MobileCta } from "./Activar";

/**
 * Landing del turnero (estructura en 10 secciones numeradas).
 * Se usa en la home (sin `niche`, con selector de rubro) y en cada /turnero/<rubro>
 * (con `niche`: textos, servicios, mensajes y FAQs del rubro → contenido único para SEO).
 *
 *  01 Hero (qué es)  02 Cómo funciona  03 Un día cualquiera  04 Probalo con tu negocio
 *  05 Demo en vivo  06 Funciones  07 Calculadora  08 Precios  09 FAQ  10 Cierre (CTA)
 *  + barra CTA fija en celular (solo entre el hero y el cierre).
 *  En celular la página se aliviana plegando lo secundario, no sacando contenido: el texto
 *  sigue en el HTML para Google.
 */
export async function TurneroLanding({ product, niche }: { product: Product; niche?: Niche }) {
  const { planes } = await getPrecios();
  const base = [...planes].sort((a, b) => a.precio_mensual - b.precio_mensual)[0];
  const faqs = niche ? [...niche.faqs, ...product.faqs] : product.faqs;
  const rubros = product.niches.map((n) => ({ href: nichePath(product, n), label: `${n.emoji} ${n.name}` }));

  return (
    <LandingState initialRubro={niche?.slug}>
      <Hero
        titulo={niche ? niche.seoTitle : "Dejá de dar turnos por WhatsApp. Que tus clientes reserven solos."}
        etiqueta={niche ? `Sistema de turnos online · ${niche.name}` : `Sistema de turnos online · ${PRUEBA_DIAS} días gratis`}
        subtitle={niche ? niche.heroSubtitle : product.heroSubtitle}
        showRubros={!niche}
      />
      <ComoFunciona n={2} />
      <Sabado n={3} />
      <Pagina n={4} showRubros={!niche} />
      <Demo n={5} />
      <Funciones n={6} rubros={rubros} extra={niche ? { title: `Pensado para ${niche.name.toLowerCase()}`, items: niche.benefits } : undefined} />
      <Calculadora n={7} planBase={base.precio_mensual} planBaseNombre={base.nombre} />
      <Precios n={8} />
      <Faq n={9} faqs={faqs} />
      <Activar n={10} />
      <MobileCta />
    </LandingState>
  );
}
