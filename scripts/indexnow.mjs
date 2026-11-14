/**
 * IndexNow: avisa a Bing (y a Yandex, Seznam, Naver) qué páginas cambiaron.
 * Bing alimenta la búsqueda de ChatGPT y de Copilot, así que esto acelera que las IA vean lo nuevo.
 *
 * Por defecto avisa SOLO las URLs cuyo <lastmod> en los sitemaps es de los últimos 3 días
 * (las fechas salen de src/config/fechas.ts). Así no se reenvía todo en cada deploy.
 *
 *   npm run indexnow                    → solo lo que cambió (lo que corre GitHub después de cada deploy)
 *   npm run indexnow -- --todas         → todas las URLs de los sitemaps
 *   npm run indexnow -- --dias 7        → lo que cambió en los últimos 7 días
 *   npm run indexnow -- https://www.prestum.com.ar/precios   → URLs puntuales
 *
 * La clave pública está en /public/<clave>.txt (así IndexNow verifica que el sitio es nuestro).
 */
const SITE = "https://www.prestum.com.ar";
const KEY = "7e64e8931b8b6735bbd8fa9e495b9a66";
const SITEMAPS = [`${SITE}/sitemap.xml`, `${SITE}/sitemap-pseo.xml`, `${SITE}/sitemap-servicios.xml`];

const args = process.argv.slice(2);
const todas = args.includes("--todas");
const iDias = args.indexOf("--dias");
const dias = iDias >= 0 ? Number(args[iDias + 1]) || 3 : 3;
const puntuales = args.filter((a) => a.startsWith("http"));

async function entradasDeSitemaps() {
  const out = [];
  for (const s of SITEMAPS) {
    const res = await fetch(s, { headers: { "cache-control": "no-cache" } });
    if (!res.ok) throw new Error(`${s} → HTTP ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
      const lastmod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();
      if (loc) out.push({ loc, lastmod: lastmod ? new Date(lastmod) : undefined });
    }
  }
  return out;
}

let urlList = puntuales;
if (!urlList.length) {
  const entradas = await entradasDeSitemaps();
  const desde = Date.now() - dias * 24 * 60 * 60 * 1000;
  urlList = [...new Set(entradas.filter((e) => todas || (e.lastmod && e.lastmod.getTime() >= desde)).map((e) => e.loc))];
}

if (!urlList.length) {
  console.log(`IndexNow: no hay páginas con cambios en los últimos ${dias} días. Nada que avisar.`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
for (const u of urlList.slice(0, 20)) console.log(`  ${u}`);
if (urlList.length > 20) console.log(`  … y ${urlList.length - 20} más`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exit(1);
}
