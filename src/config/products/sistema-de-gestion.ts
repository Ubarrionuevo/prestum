import type { Niche, Product } from "../types";

/**
 * SISTEMA DE GESTIÓN — solo reserva el slug /sistema-de-gestion.
 * La web de Prestum Gestión vive en src/app/sistema-de-gestion (contenido en config/gestion.ts),
 * con layout propio. Este producto queda en "proximamente" para que las rutas genéricas
 * de productos ([slug], [slug]/[nicho]) no generen páginas duplicadas.
 */
function draft(slug: string, name: string, business: string, emoji: string): Niche {
  return {
    slug,
    name,
    business,
    emoji,
    seoTitle: `Sistema de gestión para ${name.toLowerCase()}`,
    seoDescription: `Software de gestión para ${name.toLowerCase()} en Argentina.`,
    keywords: [`sistema de gestión para ${name.toLowerCase()}`],
    heroTitle: `Sistema de gestión para ${name.toLowerCase()}`,
    heroSubtitle: "Próximamente.",
    pains: [],
    benefits: [],
    examples: [],
    faqs: [],
  };
}

export const sistemaDeGestion: Product = {
  slug: "sistema-de-gestion",
  name: "Sistema de gestión",
  brandName: "Prestum Gestión",
  status: "proximamente",
  emoji: "📊",
  seoTitle: "Sistema de gestión para pymes y comercios",
  seoDescription:
    "Sistemas de gestión pensados para cada rubro: constructoras, pymes, kioscos y comercios de Argentina.",
  keywords: ["sistema de gestión", "software de gestión pymes", "sistema para kioscos"],
  heroTitle: "Sistemas de gestión pensados para tu rubro",
  heroSubtitle: "Stock, ventas, caja y clientes, adaptado a cómo trabaja tu negocio.",
  applicationCategory: "BusinessApplication",
  benefits: [],
  faqs: [],
  niches: [
    draft("constructoras", "Constructoras", "constructora", "🏗️"),
    draft("pymes", "Pymes", "pyme", "🏢"),
    draft("kioscos", "Kioscos", "kiosco", "🏪"),
  ],
};
