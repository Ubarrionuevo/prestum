// Arma el listado de negocios de un rubro en una ciudad a partir de OpenStreetMap (datos abiertos, ODbL).
// Uso: node scripts/directorio-osm.mjs <rubro> <ciudad> <sur,oeste,norte,este> <shop=valor|valor>
// Ej.:  node scripts/directorio-osm.mjs peluquerias mendoza -33.05,-68.95,-32.82,-68.73 hairdresser
// Escribe src/data/directorio/<rubro>-<ciudad>.json. No es Google Maps: solo datos que la comunidad cargó en OSM.
import { writeFileSync } from "node:fs";

const [rubro, ciudad, bbox, shops] = process.argv.slice(2);
if (!rubro || !ciudad || !bbox || !shops) throw new Error("Faltan argumentos (ver el comentario de arriba)");

const query = `[out:json][timeout:60];(nwr["shop"~"^(${shops})$"](${bbox}););out tags center;`;
const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: { "User-Agent": "directorio-osm-script/1.0", "Content-Type": "application/x-www-form-urlencoded" },
  body: "data=" + encodeURIComponent(query),
});
if (!res.ok) throw new Error(`Overpass respondió ${res.status}`);
const { elements } = await res.json();

const t = (e, k) => (e.tags[k] || e.tags[`contact:${k}`] || "").trim();
const negocios = elements
  .filter((e) => e.tags.name)
  .map((e) => {
    const calle = [t(e, "addr:street"), t(e, "addr:housenumber")].filter(Boolean).join(" ");
    return {
      nombre: e.tags.name.trim(),
      direccion: calle || undefined,
      localidad: t(e, "addr:city") || undefined,
      telefono: t(e, "phone").split(";")[0].trim() || undefined,
      horario: e.tags.opening_hours?.trim() || undefined,
      instagram: t(e, "instagram") || undefined,
      web: t(e, "website") || undefined,
      lat: e.lat ?? e.center?.lat,
      lon: e.lon ?? e.center?.lon,
    };
  })
  // Primero los que tienen más datos (teléfono, horario, dirección), después por nombre.
  .sort((a, b) => {
    const p = (n) => (n.telefono ? 4 : 0) + (n.horario ? 2 : 0) + (n.direccion ? 1 : 0);
    return p(b) - p(a) || a.nombre.localeCompare(b.nombre, "es");
  });

// Sin duplicados (mismo nombre y misma dirección).
const vistos = new Set();
const unicos = negocios.filter((n) => {
  const k = `${n.nombre.toLowerCase()}|${n.direccion ?? ""}`;
  if (vistos.has(k)) return false;
  vistos.add(k);
  return true;
});

const archivo = `src/data/directorio/${rubro}-${ciudad}.json`;
writeFileSync(archivo, JSON.stringify({ fuente: "OpenStreetMap", actualizado: new Date().toISOString().slice(0, 10), negocios: unicos }, null, 2) + "\n");
console.log(`Listo: ${unicos.length} negocios en ${archivo} (con teléfono: ${unicos.filter((n) => n.telefono).length}, con horario: ${unicos.filter((n) => n.horario).length})`);
