import type { Niche, Product } from "@/config/types";
import { nichePath } from "@/config/products";
import { getPrecios } from "@/lib/planes";
import { LandingState } from "./LandingState";
import { Hero } from "./Hero";
import { Sabado } from "./Sabado";
import { Funciones } from "./Funciones";
import { Calculadora } from "./Calculadora";
import { Precios } from "./Precios";
import { Faq } from "./Faq";
import { PRUEBA_DIAS } from "@/config/planes";
import { ComoFunciona } from "./ComoFunciona";
import { MobileCta } from "./Activar";
import { tituloWhatsApp } from "@/config/seo-content";
import { faqsDeRubro } from "@/lib/faqs";

/**
 * Landing del turnero (estructura en 7 secciones numeradas).
 * Se usa en la home (sin `niche`, con selector de rubro) y en cada /turnero/<rubro>
 * (con `niche`: textos, servicios, mensajes y FAQs del rubro → contenido único para SEO).
 *
 *  01 Hero (qué es)  02 Cómo funciona  03 Un día cualquiera  04 Funciones
 *  05 Calculadora  06 Precios  07 FAQ
 *  + barra CTA fija en celular (solo entre el hero y el cierre).
 *  En celular la página se aliviana plegando lo secundario, no sacando contenido: el texto
 *  sigue en el HTML para Google.
 */
export async function TurneroLanding({ product, niche }: { product: Product; niche?: Niche }) {
  const { planes } = await getPrecios(niche?.slug);
  const base = [...planes].sort((a, b) => a.precio_mensual - b.precio_mensual)[0];
  const faqs = faqsDeRubro(product, niche, planes);
  const rubros = product.niches.map((n) => ({ href: nichePath(product, n), label: `${n.emoji} ${n.name}` }));

  return (
    <LandingState initialRubro={niche?.slug}>
      <Hero
        // En la página de cada rubro el h1 usa lo que busca el dueño ("sistema de turnos para …")
        // y el mensaje "Automatizá…" queda justo debajo. La home no cambia.
        titulo={niche ? `Sistema de turnos para ${niche.name.toLowerCase()}` : tituloWhatsApp()}
        lema={niche ? tituloWhatsApp(niche.business) : undefined}
        etiqueta={niche ? `Software para ${niche.name.toLowerCase()} · ${PRUEBA_DIAS} días gratis` : `Sistema de turnos online · ${PRUEBA_DIAS} días gratis`}
        subtitle={niche ? niche.heroSubtitle : product.heroSubtitle}
        showRubros={!niche}
      />
      <ComoFunciona n={2} />
      <Sabado n={3} />
      <Funciones n={4} rubros={rubros} extra={niche ? { title: `Pensado para ${niche.name.toLowerCase()}`, items: niche.benefits } : undefined} />
      <Calculadora n={5} planBase={base.precio_mensual} planBaseNombre={base.nombre} />
      <Precios n={6} rubro={niche?.slug} />
      <Faq n={7} faqs={faqs} />
      <MobileCta />
    </LandingState>
  );
}
