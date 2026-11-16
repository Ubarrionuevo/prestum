import type { Niche, Product } from "../types";

/**
 * SISTEMA DE GESTIÓN — solo reserva el slug /sistema-de-gestion (ningún negocio puede usarlo).
 * Prestum Gestión es un proyecto aparte en https://gestion.prestum.com.ar (repo prestum-gestion);
 * /sistema-de-gestion redirige 308 allá (next.config.ts). Queda en "proximamente" para que las
 * rutas genéricas de productos no generen páginas.
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
