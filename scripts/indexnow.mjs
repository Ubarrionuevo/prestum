/**
 * IndexNow: avisa a Bing (y a Yandex, Seznam, Naver) que cambiaron páginas del sitio.
 * Bing alimenta la búsqueda de ChatGPT y de Copilot, así que esto acelera que las IA vean lo nuevo.
 *
 * Uso (después de cada deploy):   npm run indexnow
 * Solo URLs puntuales:            npm run indexnow -- https://www.prestum.com.ar/precios https://www.prestum.com.ar/
 *
 * La clave pública está en /public/<clave>.txt (así IndexNow verifica que el sitio es nuestro).
 */
const SITE = "https://www.prestum.com.ar";
const KEY = "7e64e8931b8b6735bbd8fa9e495b9a66";
const SITEMAPS = [`${SITE}/sitemap.xml`, `${SITE}/sitemap-pseo.xml`];

async function urlsDeSitemaps() {
  const urls = new Set();
  for (const s of SITEMAPS) {
    const xml = await (await fetch(s)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1].trim());
  }
  return [...urls];
}

const args = process.argv.slice(2).filter((a) => a.startsWith("http"));
const urlList = args.length ? args : await urlsDeSitemaps();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
