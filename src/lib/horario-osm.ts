// Interpreta los horarios más comunes de OpenStreetMap ("Mo-Sa 09:00-18:00; Su off", "Tu-Sa 09:00-12:30,16:30-20:30", "24/7")
// y dice si el negocio está abierto en un momento dado. Si el formato no se entiende devuelve null (no se muestra nada).
const DIAS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const NOMBRES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

type Regla = { dias: Set<number>; tramos: [number, number][] }; // minutos desde las 00:00

function parseDias(txt: string): Set<number> | null {
  const dias = new Set<number>();
  for (const parte of txt.split(",")) {
    const [a, b] = parte.split("-").map((d) => DIAS.indexOf(d.trim()));
    if (a < 0 || (b !== undefined && b < 0)) return null;
    if (b === undefined) dias.add(a);
    else
      for (let i = a; ; i = (i + 1) % 7) {
        dias.add(i);
        if (i === b) break;
      }
  }
  return dias;
}

const min = (hhmm: string) => {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};

export function parseHorario(horario: string): Regla[] | null {
  const txt = horario.trim();
  if (txt === "24/7") return [{ dias: new Set([0, 1, 2, 3, 4, 5, 6]), tramos: [[0, 1440]] }];
  const reglas: Regla[] = [];
  for (const r of txt.split(";").map((x) => x.trim()).filter(Boolean)) {
    if (/^PH\b/.test(r)) continue; // feriados: los ignoramos
    const m = r.match(/^([A-Za-z,\- ]+?)\s+(off|closed|[\d:,\- ]+)$/);
    if (!m) return null;
    const dias = parseDias(m[1].replace(/\s/g, ""));
    if (!dias) return null;
    if (m[2] === "off" || m[2] === "closed") {
      reglas.push({ dias, tramos: [] });
      continue;
    }
    const tramos: [number, number][] = [];
    for (const t of m[2].split(",")) {
      const [a, b] = t.split("-").map((x) => min(x.trim()));
      if (Number.isNaN(a) || Number.isNaN(b)) return null;
      tramos.push([a, b <= a ? b + 1440 : b]);
    }
    reglas.push({ dias, tramos });
  }
  return reglas.length ? reglas : null;
}

/** Abierto o no en este momento, en hora argentina. null si no se entiende el horario. */
export function abiertoAhora(horario: string, ahora = new Date()): boolean | null {
  const reglas = parseHorario(horario);
  if (!reglas) return null;
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(ahora);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const dia = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const m = Number(get("hour")) * 60 + Number(get("minute"));
  // La última regla que menciona el día es la que manda (como en OSM).
  const hoy = [...reglas].reverse().find((r) => r.dias.has(dia));
  if (hoy?.tramos.some(([a, b]) => m >= a && m < b)) return true;
  // Tramo del día anterior que pasa la medianoche.
  const ayer = [...reglas].reverse().find((r) => r.dias.has((dia + 6) % 7));
  if (ayer?.tramos.some(([, b]) => b > 1440 && m < b - 1440)) return true;
  return false;
}

/** "martes a sábado de 9:00 a 12:30 y de 16:30 a 20:30", o el texto original si no se entiende. */
export function horarioLegible(horario: string): string {
  const reglas = parseHorario(horario);
  if (!reglas) return horario;
  if (horario.trim() === "24/7") return "abierto las 24 horas";
  const hh = (n: number) => {
    const x = n % 1440;
    return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}`;
  };
  return reglas
    .filter((r) => r.tramos.length)
    .map((r) => {
      const d = [...r.dias].sort((a, b) => a - b);
      const corrido = d.length > 2 && d.every((x, i) => i === 0 || x === d[i - 1] + 1);
      const dias = corrido ? `${NOMBRES[d[0]]} a ${NOMBRES[d[d.length - 1]]}` : d.map((x) => NOMBRES[x]).join(", ");
      return `${dias} de ${r.tramos.map(([a, b]) => `${hh(a)} a ${hh(b)}`).join(" y de ")}`;
    })
    .join("; ");
}
