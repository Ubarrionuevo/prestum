export type ProductStatus = "activo" | "proximamente";

export interface Faq {
  q: string;
  a: string;
}

export interface Benefit {
  title: string;
  text: string;
}

/** Un nicho/rubro dentro de un producto (ej: turnero → odontólogos). */
export interface Niche {
  slug: string;
  /** Nombre en plural, como se busca: "Odontólogos". */
  name: string;
  /** Rubro en singular para frases: "consultorio odontológico". */
  business: string;
  emoji: string;
  /** <title> SEO (sin la marca, se agrega sola). Ideal < 60 caracteres. */
  seoTitle: string;
  /** Meta description. Ideal 140–160 caracteres. */
  seoDescription: string;
  keywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  /** Problemas concretos del rubro que el producto resuelve. */
  pains: string[];
  benefits: Benefit[];
  /** Ejemplos para mostrar en la landing (texto libre). */
  examples: string[];
  faqs: Faq[];
}

/** Un producto/app que vive dentro de prestum.com.ar. */
export interface Product {
  slug: string;
  name: string;
  /** Marca visible del producto, ej: "Prestum Turnos". Cada producto se presenta como un software propio. */
  brandName: string;
  /** Link a la demo (si el producto tiene). */
  demoPath?: string;
  status: ProductStatus;
  emoji: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  /** Categoría para schema.org SoftwareApplication. */
  applicationCategory: string;
  benefits: Benefit[];
  faqs: Faq[];
  niches: Niche[];
}
