import { absoluteUrl } from "@/config/site";
import { faqsGestion, funcionGestionPath, funcionesGestion, gestion, precioGestion, rubroGestionPath, rubrosGestion } from "@/config/gestion";

// Resumen para IA (ChatGPT, Gemini, Claude) de Prestum Gestión. Marca propia: no menciona otros productos.
export const dynamic = "force-static";

export function GET() {
  const txt = `# ${gestion.marca}

> ${gestion.definicion}

## Precio
- ${precioGestion} por mes, en pesos argentinos, con todas las funciones incluidas.
- Demo por WhatsApp: https://wa.me/${gestion.whatsapp}

## Funciones
${funcionesGestion.map((f) => `- [${f.nombre}](${absoluteUrl(funcionGestionPath(f))}): ${f.corto}`).join("\n")}

## Rubros
${rubrosGestion.map((r) => `- [${r.h1}](${absoluteUrl(rubroGestionPath(r))}): ${r.descripcion}`).join("\n")}

## Preguntas frecuentes
${faqsGestion.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`;
  return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
