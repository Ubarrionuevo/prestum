// Listados de negocios por rubro y ciudad, armados con scripts/directorio-osm.mjs a partir de OpenStreetMap.
// Solo existen para algunas páginas de ciudad; el resto no muestra listado.
import peluqueriasMendoza from "@/data/directorio/peluquerias-mendoza.json";

export type NegocioListado = {
  nombre: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  horario?: string;
  instagram?: string;
  web?: string;
  lat?: number;
  lon?: number;
};
export type Directorio = { fuente: string; actualizado: string; negocios: NegocioListado[] };

const DIRECTORIOS: Record<string, Directorio> = {
  "peluquerias/mendoza": peluqueriasMendoza,
};

export const getDirectorio = (rubro: string, ciudad: string): Directorio | undefined => DIRECTORIOS[`${rubro}/${ciudad}`];
