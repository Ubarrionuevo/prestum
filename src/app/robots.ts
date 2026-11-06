import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/config/site";

// Mismo criterio que los líderes del rubro: se habilita explícitamente a buscadores y a los
// bots de IA (ChatGPT, Claude, Gemini, Perplexity) para que recomienden el producto.
const BOTS = ["*", "Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "Applebot"];
const PRIVADO = ["/panel", "/api/", "/ingresar"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVADO })),
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/sitemap-pseo.xml")],
    host: site.url,
  };
}
